#!/usr/bin/env node
/*
  Fonoestratonika — puente OSC ⇄ WebSocket (v078)
  Sin dependencias: solo Node.js 18 o más reciente.

  El navegador no puede hablar UDP, así que la app manda sus mensajes OSC como JSON
  por WebSocket y este puente los convierte en paquetes OSC/UDP para Isadora,
  TouchDesigner, Max, Resolume… y al revés: lo que llega por OSC al puerto de entrada
  se reenvía a la app.

  Además sirve la carpeta de la app por HTTP, así que basta con abrir
  http://localhost:8080 (o la IP de esta computadora desde un iPad en la misma red).

  Uso:
    node puente.js
    node puente.js --out 127.0.0.1:1234 --in 9001 --ws 8080
    node puente.js --out 127.0.0.1:1234,100.101.102.103:1234   (varios destinos, p. ej. por Tailscale)

  Opciones:
    --ws    puerto HTTP/WebSocket (8080)
    --out   destino(s) OSC host:puerto, separados por coma (127.0.0.1:1234, el puerto por defecto de Isadora)
    --in    puerto UDP donde escucha OSC entrante (9001)
    --root  carpeta que se sirve por HTTP (la carpeta de arriba de este archivo)
    --ver   muestra en consola cada mensaje

  Diseño, investigación y desarrollo: Héctor Cruz Juárez — https://hectorcruz.com.mx
  Colección Alchemy of Meaning. Licencia GPL-3.0-or-later.
*/
'use strict';
const http = require('http'), dgram = require('dgram'), crypto = require('crypto');
const fs = require('fs'), path = require('path'), os = require('os');

const A = { ws: '8080', out: '127.0.0.1:1234', in: '9001', root: path.join(__dirname, '..'), ver: false };
for (let i = 2; i < process.argv.length; i++) {
  const k = process.argv[i].replace(/^--/, '');
  if (k === 'ver') { A.ver = true; continue; }
  if (k in A && process.argv[i + 1] !== undefined) A[k] = process.argv[++i];
}
const targets = A.out.split(',').map(s => {
  const i = s.lastIndexOf(':');
  return { host: s.slice(0, i).trim(), port: +s.slice(i + 1) };
}).filter(t => t.host && t.port > 0);
const ROOT = path.resolve(A.root);

/* ---------- OSC ---------- */
const pad4 = n => (4 - (n % 4)) % 4;
function oscStr(s) {
  const b = Buffer.from(String(s), 'utf8');
  return Buffer.concat([b, Buffer.alloc(1 + pad4(b.length + 1))]);
}
function encode(a, t, v) {
  v = Array.isArray(v) ? v : [];
  if (typeof t !== 'string' || t.length !== v.length)
    t = v.map(x => typeof x === 'string' ? 's' : Number.isInteger(x) ? 'i' : 'f').join('');
  const parts = [oscStr(a), oscStr(',' + t)];
  for (let i = 0; i < t.length; i++) {
    const c = t[i], x = v[i];
    if (c === 'i') { const b = Buffer.alloc(4); b.writeInt32BE(Math.max(-2147483648, Math.min(2147483647, Math.round(+x) || 0))); parts.push(b); }
    else if (c === 'f') { const b = Buffer.alloc(4); b.writeFloatBE(+x || 0); parts.push(b); }
    else if (c === 'd') { const b = Buffer.alloc(8); b.writeDoubleBE(+x || 0); parts.push(b); }
    else if (c === 's') parts.push(oscStr(x));
  }
  return Buffer.concat(parts);
}
function rStr(buf, o) {
  let e = o; while (e < buf.length && buf[e] !== 0) e++;
  const n = e - o + 1;
  return [buf.toString('utf8', o, e), o + n + pad4(n)];
}
function decode(buf, out) {
  if (buf.length < 4) return out;
  let [a, o] = rStr(buf, 0);
  if (a === '#bundle') {
    o += 8;
    while (o + 4 <= buf.length) {
      const n = buf.readInt32BE(o); o += 4;
      if (n <= 0 || o + n > buf.length) break;
      decode(buf.subarray(o, o + n), out); o += n;
    }
    return out;
  }
  let t = '';
  if (o < buf.length && buf[o] === 44) { [t, o] = rStr(buf, o); t = t.slice(1); }
  const v = [];
  for (const c of t) {
    if (c === 'i' || c === 'c' || c === 'r' || c === 'm') { v.push(buf.readInt32BE(o)); o += 4; }
    else if (c === 'f') { v.push(buf.readFloatBE(o)); o += 4; }
    else if (c === 's' || c === 'S') { let s; [s, o] = rStr(buf, o); v.push(s); }
    else if (c === 'd') { v.push(buf.readDoubleBE(o)); o += 8; }
    else if (c === 'h') { v.push(Number(buf.readBigInt64BE(o))); o += 8; }
    else if (c === 't') o += 8;
    else if (c === 'T') v.push(1);
    else if (c === 'F') v.push(0);
    else if (c === 'b') { const n = buf.readInt32BE(o); o += 4 + n + pad4(n); }
    else if (c === 'N' || c === 'I' || c === '[' || c === ']') { }
    else break;
  }
  out.push({ a, v });
  return out;
}

/* ---------- UDP ---------- */
const tx = dgram.createSocket('udp4');
tx.on('error', e => console.error('[osc salida]', e.message));
const rx = dgram.createSocket({ type: 'udp4', reuseAddr: true });
rx.on('error', e => { console.error(`[osc entrada] no pude escuchar el puerto ${A.in}:`, e.message); });
rx.on('message', (m, r) => {
  let list = [];
  try { list = decode(m, []); } catch (e) { return; }
  if (!list.length) return;
  if (A.ver) list.forEach(o => console.log('←', r.address, o.a, o.v.join(' ')));
  broadcast(list);
});
rx.bind(+A.in);

function sendOsc(msg) {
  if (!msg || typeof msg.a !== 'string' || msg.a[0] !== '/') return;
  let b;
  try { b = encode(msg.a, msg.t, msg.v); } catch (e) { return; }
  if (A.ver) console.log('→', msg.a, (msg.v || []).join(' '));
  for (const t of targets) tx.send(b, t.port, t.host);
}

/* ---------- HTTP: sirve la app ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || '/').split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.resolve(ROOT, '.' + u);
  if (!f.startsWith(ROOT + path.sep) && f !== ROOT) { res.writeHead(403); res.end(); return; }
  fs.stat(f, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('no encontrado'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(res);
  });
});

/* ---------- WebSocket mínimo (RFC 6455) ---------- */
const clients = new Set();
function frame(p, op = 1) {
  const n = p.length; let h;
  if (n < 126) h = Buffer.from([0x80 | op, n]);
  else if (n < 65536) { h = Buffer.alloc(4); h[0] = 0x80 | op; h[1] = 126; h.writeUInt16BE(n, 2); }
  else { h = Buffer.alloc(10); h[0] = 0x80 | op; h[1] = 127; h.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([h, p]);
}
function broadcast(obj) {
  const f = frame(Buffer.from(JSON.stringify(obj)));
  for (const c of clients) try { c.sock.write(f); } catch (e) { }
}
function onWs(text) {
  let m; try { m = JSON.parse(text); } catch (e) { return; }
  (Array.isArray(m) ? m : [m]).forEach(sendOsc);
}
function parseFrames(c) {
  for (;;) {
    const b = c.buf; if (b.length < 2) return;
    const fin = b[0] & 0x80, op = b[0] & 0x0f, masked = b[1] & 0x80;
    let len = b[1] & 0x7f, o = 2;
    if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); o = 4; }
    else if (len === 127) { if (b.length < 10) return; len = Number(b.readBigUInt64BE(2)); o = 10; }
    if (len > (1 << 24)) { c.sock.destroy(); return; }
    const mk = masked ? 4 : 0;
    if (b.length < o + mk + len) return;
    let p = Buffer.from(b.subarray(o + mk, o + mk + len));
    if (masked) { const k = b.subarray(o, o + 4); for (let i = 0; i < p.length; i++) p[i] ^= k[i & 3]; }
    c.buf = b.subarray(o + mk + len);
    if (op === 8) { try { c.sock.end(frame(Buffer.alloc(0), 8)); } catch (e) { } clients.delete(c); return; }
    if (op === 9) { try { c.sock.write(frame(p, 10)); } catch (e) { } continue; }
    if (op === 10) continue;
    c.frag.push(p);
    if (fin) { const t = Buffer.concat(c.frag).toString('utf8'); c.frag = []; onWs(t); }
  }
}
server.on('upgrade', (req, sock) => {
  const key = req.headers['sec-websocket-key'];
  if (!key || String(req.headers.upgrade || '').toLowerCase() !== 'websocket') { sock.destroy(); return; }
  const acc = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + acc + '\r\n\r\n');
  sock.setNoDelay(true);
  const c = { sock, buf: Buffer.alloc(0), frag: [] };
  clients.add(c);
  console.log(`app conectada (${clients.size})`);
  sock.on('data', d => { c.buf = Buffer.concat([c.buf, d]); try { parseFrames(c); } catch (e) { sock.destroy(); } });
  const bye = () => { if (clients.delete(c)) console.log(`app desconectada (${clients.size})`); };
  sock.on('close', bye); sock.on('error', bye);
});
server.on('error', e => { console.error(`no pude abrir el puerto ${A.ws}:`, e.message); process.exit(1); });

server.listen(+A.ws, () => {
  const ips = [];
  for (const list of Object.values(os.networkInterfaces())) for (const n of list || [])
    if (n.family === 'IPv4' && !n.internal) ips.push(n.address);
  console.log('\nFonoestratonika — puente OSC ⇄ WebSocket');
  console.log(`  app:          http://localhost:${A.ws}` + ips.map(ip => `   http://${ip}:${A.ws}`).join(''));
  console.log(`  OSC sale a:   ${targets.map(t => t.host + ':' + t.port).join(', ') || '(ninguno)'}`);
  console.log(`  OSC entra en: puerto ${A.in}`);
  console.log('  ctrl+c para cerrar\n');
});
