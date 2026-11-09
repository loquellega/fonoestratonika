# Fonoestratonika

**Español** · [English](#english)

Artefacto web de la colección **Alchemy of Meaning (Alquimia del Significado)**. Convierte imágenes en una nube de puntos en 3D y la lee con un barrido que genera sonido: luminosidad, bordes y posición se traducen en notas, timbres, un bordón continuo y un espectro visible. Puede funcionar solo (Autopilot) como instalación permanente.

## Uso

1. Abre `index.html` en el navegador (o la versión en línea) y pulsa **sonar**. Eso activa el audio y entra en modo edición, con todas las ventanas.
2. Controles: ventanas laterales (secuencia, análisis, espectro, partitura) y dock inferior (control, sonido, generador, bordón).
3. Teclas útiles: `espacio` sonar/detener, `h` ocultar la interfaz, `f` pantalla completa.
4. **Autopilot** viene activo: alterna imágenes y modos sin intervención.

### Tus fotos

Copia tus `.jpg`/`.png` a la carpeta `fotos/`, y en `fotos/listado.txt` escribe un nombre por línea (las líneas con `#` se ignoran). Si la lista está vacía, la app usa 3 imágenes de muestra. El botón «quitar todas y cargar las mías» sustituye la galería actual.

## Correrlo

Es un solo archivo, sin dependencias ni compilación. Para que la carpeta `fotos/` se cargue automáticamente conviene servirlo por HTTP:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000/`. Funciona sin conexión (Inter se carga de Google Fonts solo si hay red; si no, usa Arial).

## Estilo

La interfaz sigue el skill [`alchemy-ui`](skills/alchemy-ui/SKILL.md) (tokens y componentes reutilizables en `skills/alchemy-ui/`).

## Versión

v077 — estilo alchemy-ui v1.

## Créditos y licencia

Diseño, investigación y desarrollo: **Héctor Cruz Juárez** — https://hectorcruz.com.mx
Licencia GPL-3.0 (ver `LICENSE`).

---

## English

A web artefact from the **Alchemy of Meaning (Alquimia del Significado)** collection. It turns images into a 3D point cloud and reads it with a sweep that generates sound: luminosity, edges and position become notes, timbres, a continuous drone and a live spectrum. It can run unattended (Autopilot) as a permanent installation.

### Usage

1. Open `index.html` in a browser (or the hosted version) and press **sonar** (play). This starts audio and lands in edit mode with all windows.
2. Controls: side windows (sequence, analysis, spectrum, score) and a bottom dock (control, sound, generator, drone).
3. Handy keys: `space` play/stop, `h` hide the interface, `f` fullscreen.
4. **Autopilot** is on by default: it alternates images and modes hands-free.

### Your photos

Copy your `.jpg`/`.png` files into `fotos/` and list one filename per line in `fotos/listado.txt` (lines starting with `#` are ignored). With an empty list the app uses 3 generated sample images. The "quitar todas y cargar las mías" button replaces the current gallery.

### Run it

Single file, no dependencies or build step. To auto-load `fotos/`, serve it over HTTP:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`. It works offline (Inter loads from Google Fonts only when online; otherwise Arial).

### Style

The UI follows the [`alchemy-ui`](skills/alchemy-ui/SKILL.md) skill (reusable tokens and components in `skills/alchemy-ui/`).

### Version

v077 — alchemy-ui v1 style.

### Credits and license

Design, research and development: **Héctor Cruz Juárez** — https://hectorcruz.com.mx
GPL-3.0 license (see `LICENSE`).
