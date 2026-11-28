# Fonoestratonika v084 · enlace OSC · MIDI

Así se usa Fonoestratonika como instrumento dentro de otro sistema (Isadora, TouchDesigner, Max, Ableton, un sinte): envía sus notas y datos, y recibe control desde fuera.

## Arranque rápido

1. Instala Node.js 18 o más reciente (https://nodejs.org).
2. En una terminal, desde la carpeta de la app:
   ```
   node puente/puente.js --out 127.0.0.1:1234 --in 9001
   ```
3. Abre **http://localhost:8080** en Chrome o Edge y pulsa **sonar**.
4. En la ventana **Enlace OSC · MIDI**, pulsa **conectar** (la dirección ya viene puesta) y, si vas a usar MIDI, **activar MIDI** y elige los puertos.

El puente también sirve la app. Desde un iPad en la misma red, abre la IP que muestra la terminal (`http://192.168.x.x:8080`). OSC funciona ahí, pero MIDI no, porque Safari no tiene Web MIDI.

> Si abres la app desde un sitio **https**, el navegador bloquea la conexión `ws://` al puente. Ábrela desde el puente (http) o como archivo local.

### Opciones del puente

| opción | qué hace | por defecto |
|---|---|---|
| `--ws` | puerto de la app y del WebSocket | 8080 |
| `--out` | destino(s) OSC `host:puerto`, separados por coma | 127.0.0.1:1234 (Isadora) |
| `--in` | puerto UDP donde escucha OSC | 9001 |
| `--ver` | muestra cada mensaje en la terminal | — |

Para tocar a distancia por **Tailscale**, añade la IP 100.x de la otra máquina: `--out 127.0.0.1:1234,100.101.102.103:1234`. Del otro lado, que manden su OSC a la IP Tailscale de esta máquina, puerto 9001.

### MIDI sin cables

- **Mac**: Audio MIDI Setup → ventana MIDI → doble clic en *IAC Driver* → activa «El dispositivo está conectado». Elige *IAC Bus 1* como salida en la app y como entrada en Isadora/Ableton.
- **Windows**: instala loopMIDI y crea un puerto.

## Botones del enlace

- **notas**: envía cada nota del generador, el acorde de cada compás y el bordón.
- **datos**: envía el barrido continuo (~30 Hz), el pulso y, al cambiar de foto, sus rasgos.
- **reloj**: envía reloj MIDI (24 ppq) con el tempo del generador, para que otro siga a Fonoestratonika.
- **control**: acepta OSC y MIDI entrantes.
- **seguir reloj externo**: el generador deja su reloj y avanza solo con reloj MIDI (12 pulsos por paso, así que cada paso es una corchea) o con `/fono/tick`. Start y stop de MIDI arrancan y detienen.
- **sonido interno**: apágalo para que solo suenen tus sintes. La partitura, el espectro y los datos siguen corriendo.

## OSC que sale

| dirección | argumentos | cuándo |
|---|---|---|
| `/fono/note` | `i` timbre (0 campana, 1 piano, 2 bambú) · `i` nota MIDI · `f` velocidad 0–1 · `f` paneo −1…1 · `f` frecuencia Hz | en el instante exacto en que suena |
| `/fono/chord` | `i` grado · `i` nota MIDI de la fundamental · `i` compás | al inicio de cada compás |
| `/fono/drone` | `i` nota MIDI (−1 = suelto) · `f` Hz · `f` amplitud | al cambiar el bordón |
| `/fono/step` | `i` paso 0–7 · `i` compás | cada corchea |
| `/fono/pos` | `f` 0–1 | barrido |
| `/fono/band/1` … `/4` | `f` 0–1 | energía de las cuatro bandas (1 grave, 4 agudo) |
| `/fono/level` | `f` 0–1 | nivel de salida |
| `/fono/edges` | `f` 0–1 | bordes bajo el barrido |
| `/fono/centroid` | `f` 0–1 | brillo espectral |
| `/fono/active` | `f` 0–1 | puntos activos |
| `/fono/image` | `i` índice · `s` nombre | al cambiar de foto |
| `/fono/feat` | `f` tono · `f` saturación · `f` luz media · `f` contraste · `f` bordes | al cambiar de foto |
| `/fono/key` | `i` tónica 0–11 · `i` escala 0–5 | al cambiar la tonalidad |
| `/fono/tension` | `f` 0 consonante … 1 disonante | tensión armónica de las notas que suenan juntas (v083) |

Los datos continuos solo se envían cuando cambian.

## OSC que entra (puerto 9001)

| dirección | argumentos |
|---|---|
| `/fono/play` | 1/0 |
| `/fono/gen` · `/fono/autopilot` · `/fono/color` · `/fono/photo` | 1/0 (`photo` funde entre nube y fotografía) |
| `/fono/next` · `/fono/prev` · `/fono/flash` | — |
| `/fono/image` | índice |
| `/fono/tonic` | 0–11 · `/fono/scale` 0–5 (pent menor, dórica, tonos, armónicos, pent mayor, frigia) |
| `/fono/mode` | 0 barrido, 1 radial, 2 profundidad |
| `/fono/inst` | timbre 0–2 · 1/0 |
| `/fono/note` | timbre 0–2 · nota MIDI · velocidad (0–1 o 0–127) |
| `/fono/drone` | nota MIDI · amplitud (0 suelta esa nota); hasta 4 a la vez |
| `/fono/release` | suelta el bordón |
| `/fono/pins` | 1/0 clavos · `/fono/pinMap` 0 altura, 1 luz, 2 disperso, 3 teclado (v082) |
| `/fono/listen` · `/fono/pinSub` | 1/0 la nube escucha · subestructuras (v082) |
| `/fono/pinHarm` · `/fono/pinColor` | 1/0 armonía · color por nota (v083) |
| `/fono/pinWave` | 0 rectas · 1 ondulan al bajar · 2 siempre (v084); `/fono/pinWaveA` cuánto ondulan |
| `/fono/tick` | avanza un paso (con «seguir reloj externo») |
| `/fono/harm` · `/fono/hold` · `/fono/pat` · `/fono/morph` | 1/0 (v081: el teclado manda, hold, patrón, morph) |
| `/fono/hnote` | nota MIDI · velocidad (0 suelta) — nota de armonía (v081) |
| `/fono/hclear` | suelta el acorde de armonía (v081) |
| `/fono/patLen` | 8, 16, 24 o 32 (v081) |
| `/fono/corner` | 0–3: lleva el morph a la esquina A, B, C o D (v081) |
| `/fono/<deslizador>` | valor en sus unidades, p. ej. `/fono/gdens 0.7`, `/fono/speed 30` |
| `/fono/norm/<deslizador>` | 0–1 mapeado a su rango, p. ej. `/fono/norm/rev 0.5` |

Deslizadores (v081 suma `mx my bpmFix`; v082 suma `pinLift`): `pinH pinTail dCore dSub dSaw dFifth dOct dDetune dCut dRes dBreath dBreathD dAtk dRel pos speed vol gdens gtempo myst gvol pad rev bright noise thr width img oct rest glide range fade lvol density depth size apBpm every` y los de película (`fContrast fGrain`…).

Con «tonalidad de la imagen» encendido, cada foto nueva vuelve a fijar su tónica y su escala. Apágalo si quieres llevar la tonalidad desde fuera.

## MIDI

**Sale**
- Canal 1 campana · 2 piano · 3 bambú: nota con su velocidad y su duración.
- Canal 4: bordón sostenido.
- Canal 5, CC 20 pos · 21–24 bandas · 25 nivel · 26 bordes · 27 centroide · 28 activos · 34 tensión armónica · 29–33 rasgos de la foto (tono, saturación, luz, contraste, bordes). Program change = índice de la foto.
- Reloj MIDI, si está activo.

**Entra**

*Teclado* (selector «teclado MIDI toca»):
- **dividido** (por defecto): abajo del corte (do 4, nota 60) toca el **bordón**. Arriba, la primera octava es bambú, la segunda piano y de ahí para arriba campana. «fijar corte» y una tecla lo mueven.
- **bordón**, **campana**, **piano** o **bambú**: todo el teclado toca ese timbre, en cualquier canal.
- **por canal**: como en v078. Canal 1 campana, 2 piano, 3 bambú, 4 bordón; en otros canales el timbre lo decide el registro.

El bordón por teclado es **polifónico**: hasta 4 notas sostenidas, cada una en su voz. Viene en afinación libre; «bordón en la escala» ajusta cada nota a la escala actual.

*Expresión:*
- Pedal (CC 64): sostiene.
- Pitch bend: ±2 semitonos al bordón y a las notas.
- Aftertouch de canal: abre el filtro del bordón.
- CC 120/123: suelta todo.

*Perillas por defecto* (cualquier canal, cercanas a General MIDI):

| CC | parámetro | CC | parámetro |
|---|---|---|---|
| 1 rueda de modulación | filtro del bordón | 71 | resonancia del bordón |
| 2 | misterio | 72 | caída del bordón |
| 3 | tempo | 73 | ataque del bordón |
| 4 | colchón del barrido | 74 | brillo |
| 5 | nivel del generador | 75 | ruido de bordes |
| 7 | volumen | 76 | nube ↔ foto |
| 12 | densidad | 77 | paisaje |
| 13 | profundidad de respiración | 78 | fundido |
| 14 | posición | 79 | bordón en reposo |
| 15 | pasada | 80 | glissando |
| 16 | ancho del barrido | 91 | reverb |
| 17 | umbral | 94 | desafinado |
| 18 | morph X (v081) | 19 | morph Y (v081) |

*MIDI learn:* pulsa **aprender**, toca cualquier deslizador de la app y mueve una perilla o un fader. Queda asignado (perilla y canal) y tiene prioridad sobre la tabla. Se pueden asignar varios seguidos; **terminar** cierra el modo. Las asignaciones se guardan en el navegador y se borran con ×.

*Otros:* program change cambia a esa foto. Reloj, start, continue y stop funcionan con «seguir reloj externo».

## Voz del bordón (v079)

La ventana **Bordón — voz** del dock abre el sintetizador del bordón: cuerpo, sub, sierras, quinta y octava (la mezcla de sus capas); desafinado de las sierras; filtro y resonancia; respiración (velocidad y profundidad del LFO sobre el filtro); ataque y caída. También elige qué suman los dedos o las teclas extra: terceras, cuartas, racimo u octavas. Todo se guarda en los presets y responde a OSC: `/fono/dCut 0.7`, `/fono/norm/dRes 0.4`, `/fono/dAtk 1.5`…

## Isadora en dos minutos

1. Communications → Stream Setup → OSC, puerto 1234 → «Auto-Detect Input» y toca algo en la app. Aparecen `/fono/note`, `/fono/pos`, etc.
2. Usa un actor **OSC Listener** por canal. `/fono/band/1` a una intensidad, `/fono/note` a un disparador.
3. Para controlar la app: un actor **OSC Transmit** a la IP de la máquina del puente, puerto 9001, dirección `/fono/gdens`.

## TouchDesigner

- **OSC In CHOP**, puerto 1234: cada dirección numérica llega como canal (`fono/band/1`, `fono/pos`…).
- **OSC In DAT** para `/fono/note` e `/fono/image`, que traen varios argumentos o texto.
- **OSC Out CHOP/DAT** a puerto 9001 para mandar control.

---
Diseño, investigación y desarrollo: Héctor Cruz Juárez — https://hectorcruz.com.mx
Colección Alchemy of Meaning. GPL-3.0-or-later.
