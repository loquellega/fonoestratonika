# Fonoestratonika

**Español** · [English](#english)

![Fonoestratonika en modo edición](docs/capturas/02-edicion.png)

Artefacto web de la colección **Alchemy of Meaning (Alquimia del Significado)**. Convierte fotografías en una nube de puntos en 3D y la lee con un barrido que genera sonido: luminosidad, bordes, color y posición se traducen en notas, timbres, un bordón continuo y un espectro visible. Puede funcionar solo (Autopilot) como instalación permanente, o tocarse como instrumento con el tacto, un teclado MIDI o desde Isadora y TouchDesigner por OSC.

Se estrenó en el simposio Baja Rare, dedicado a la flora rara y endémica de la península, en Loreto, Baja California Sur.

## Cómo funciona

**1. La foto se vuelve datos.** Cada imagen se reduce a una cuadrícula de unos 120 × 80 puntos. De cada punto se mide la luz, la fuerza de sus bordes y su color. De la imagen entera salen cinco rasgos: tono dominante, saturación, luz media, contraste y cantidad de bordes. Con esos cinco números se arma una **semilla**: la misma foto produce siempre la misma música.

**2. La nube y el barrido.** Los puntos con luz se elevan en profundidad según su brillo y forman la nube. Un plano recorre la nube de lado a lado, en anillo desde el centro o en profundidad. Lo que toca se reparte en 24 bandas, de grave a agudo, que suenan como un colchón aditivo continuo. Los bordes bajo el plano suman ruido filtrado.

**3. Las notas procedurales.** El generador no depende del barrido: tiene su propio reloj y la foto decide cómo es ese reloj.
- **Tonalidad:** el tono de color elige la tónica entre las 12 notas. La luz elige la escala: con poca saturación, tonos enteros; muy oscura, frigia; oscura, pentatónica menor; media, dórica; clara, pentatónica mayor.
- **Progresión:** la semilla genera 4 acordes, con saltos de 1 a 5 grados en la escala. El contraste decide si los saltos tienden a ser cortos o largos.
- **Tempo:** sale de los bordes. Una foto lisa va a unos 40 bpm y una muy texturada a unos 110. Cada paso es una corchea y 8 pasos forman un compás. Al inicio de cada compás el piano toca la fundamental del acorde.
- **Qué punto suena:** en cada paso se elige un punto de la imagen con una secuencia basada en la proporción áurea. Así se va recorriendo toda la foto sin repetirse y sin amontonarse.
- **Si suena o calla:** la probabilidad sube con la luz del punto, con el tiempo fuerte (pasos 1 y 5) y con la densidad. Cada cuatro compases hay uno con menos notas, como una respiración.
- **Timbre y altura:** un punto en un borde suena como bambú. Si no está en un borde, en la mitad alta suena como campana y en la baja como piano. La altura es una nota del acorde actual, más aguda cuanto más arriba esté el punto. La velocidad depende de la luz del punto y el paneo de su posición horizontal.
- **Misterio:** de vez en cuando aparece una nota de tensión, una segunda menor o un tritono. Lo hace más seguido en fotos oscuras y siempre en campana.

Los tres timbres se sintetizan en vivo, sin grabaciones. La campana usa parciales inarmónicos con cola larga, el piano usa FM suave con golpe de martillo y el bambú una ráfaga de ruido con resonador afinado.

**Clavos (v080).** Idea de Maximiliano Wille. Las 88 teclas del piano se reparten en partes iguales entre los puntos de la foto. Cuando suena una nota, del generador, del teclado o del bordón, sus puntos suben hacia el frente con una línea fina, crecen y se encienden, como los tableros de clavos que toman el molde de una mano. Hay tres repartos:
- **altura:** grave abajo, agudo arriba.
- **luz:** grave en lo oscuro, agudo en lo claro.
- **disperso:** cada tecla salpicada por toda la imagen.

En altura y luz cada nota también empuja un poco a sus vecinas, como la presión de un dedo. Las campanas duran más que el piano y el bambú, y el bordón sostiene sus clavos mientras suena. Se ajusta en la ventana **Nube**: clavos, reparto, altura del clavo y cola. «Marcas» vuelve a mostrar los círculos de antes.

**4. El bordón.** Es una voz sostenida de siete osciladores: cuerpo, sub, sierras desafinadas, quinta y octava, pasados por un filtro que respira con un LFO lento. Se toca sobre la imagen: la altura va en vertical y el volumen y el brillo en horizontal. Cada dedo extra suma un grado (terceras, cuartas, racimo u octavas). También se toca con teclado MIDI, hasta 4 notas a la vez. La ventana **Bordón — voz** abre toda su mezcla, el filtro, la respiración, el ataque y la caída.

**5. Paisaje.** Una capa opcional de viento, oleaje, marea, aves y desierto, también sintetizada. Se siembra desde el color y la textura de cada foto: los azules traen agua, los verdes aves y los cálidos desierto.

**6. Película.** Las fotos pasan por un tratamiento blanco y negro estilo HP5, con grano, contraste y viñeta ajustables. El análisis se hace sobre esa versión.

## Uso

1. Abre `index.html` en el navegador (o la versión en línea) y pulsa **sonar**. Eso activa el audio y entra en modo edición, con todas las ventanas.
2. Controles: ventanas laterales (secuencia, análisis, espectro, partitura, enlace) y dock inferior (control, sonido, generador, bordón, voz del bordón).
3. Teclas útiles: `espacio` sonar/detener, `h` ocultar la interfaz, `f` pantalla completa, `←` `→` cambiar de foto, `g` generador, `m` modo de barrido.
4. **Autopilot** viene activo: alterna imágenes y modos sin intervención.

### Tus fotos

Copia tus `.jpg`/`.png` a la carpeta `fotos/`, y en `fotos/listado.txt` escribe un nombre por línea (las líneas con `#` se ignoran). Si la lista está vacía, la app usa 3 imágenes de muestra. El botón «quitar todas y cargar las mías» sustituye la galería actual.

### Teclado MIDI y controladores (v079)

En Chrome o Edge, ventana **Enlace OSC · MIDI** → **activar MIDI**, y elige tu teclado como entrada.
- **Dividido** (por defecto): abajo de do 4 tocas el bordón; arriba, bambú, piano y campana por octavas. «fijar corte» mueve la división.
- **Bordón polifónico:** hasta 4 notas sostenidas, en afinación libre o ajustadas a la escala.
- **Expresión:** el pedal sostiene, el pitch bend da ±2 semitonos y el aftertouch abre el filtro.
- **Perillas:** el mapa por defecto sigue General MIDI (1 filtro, 71 resonancia, 72 caída, 73 ataque, 74 brillo, 91 reverb). Con **aprender**, tocas un deslizador y mueves cualquier perilla para asignarla.

### OSC (Isadora, TouchDesigner, Max) (v078)

Fonoestratonika envía sus notas, el bordón, el barrido y los rasgos de cada foto, y recibe control y reloj. El navegador no habla UDP, así que OSC pasa por un puente pequeño sin dependencias (Node.js 18+):

```
node puente/puente.js --out 127.0.0.1:1234 --in 9001
```

Luego abre `http://localhost:8080`. El puente sirve la app y acepta varios destinos, por ejemplo una IP de Tailscale para tocar a distancia. El mapa completo de direcciones, CC y canales está en [`puente/LEEME.md`](puente/LEEME.md).

## Correrlo

Es un solo archivo, sin dependencias ni compilación. Para que la carpeta `fotos/` se cargue automáticamente conviene servirlo por HTTP, con el puente o con:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000/`. Funciona sin conexión (Inter se carga de Google Fonts solo si hay red; si no, usa Arial).

## Capturas / Screenshots

| | | |
|---|---|---|
| ![Inicio](docs/capturas/01-inicio.png)<br>Pantalla de inicio / Start screen | ![Edición](docs/capturas/02-edicion.png)<br>Modo edición / Edit mode | ![HUD mínimo](docs/capturas/03-hud-minimo.png)<br>HUD mínimo (tecla h) / Minimal HUD (key h) |
| ![Enlace OSC · MIDI](docs/capturas/04-enlace-osc-midi.png)<br>Enlace OSC · MIDI / OSC · MIDI link | ![Bordón y voz](docs/capturas/05-bordon-voz.png)<br>Bordón y su voz / Drone and its voice | ![MIDI learn](docs/capturas/06-midi-learn.png)<br>MIDI learn |
| ![Clavos](docs/capturas/07-clavos.png)<br>Clavos: un acorde levanta sus puntos / Pins: a chord lifts its points | | |

## Estilo

La interfaz sigue el skill [`alchemy-ui`](skills/alchemy-ui/SKILL.md) (tokens y componentes reutilizables en `skills/alchemy-ui/`).

## Versión

v080: clavos (cada nota levanta sus puntos de la nube; idea de Maximiliano Wille).
v079: teclado MIDI (bordón polifónico, dividido, pedal, pitch bend, aftertouch, MIDI learn) y voz del bordón abierta.
v078: enlace OSC · MIDI (envía y recibe) y puente OSC.

---

## English

A web artefact from the **Alchemy of Meaning (Alquimia del Significado)** collection. It turns photographs into a 3D point cloud and reads it with a sweep that generates sound. Luminosity, edges, colour and position become notes, timbres, a continuous drone and a live spectrum. It can run unattended (Autopilot) as a permanent installation, or be played as an instrument by touch, with a MIDI keyboard, or from Isadora and TouchDesigner over OSC.

It premiered at the Baja Rare symposium on rare and endemic flora of the peninsula, in Loreto, Baja California Sur.

### How it works

**1. The photo becomes data.** Each image is reduced to a grid of about 120 × 80 points, measuring light, edge strength and colour. Five global features come from the whole image: dominant hue, saturation, mean light, contrast and amount of edges. They form a **seed**, so the same photo always produces the same music.

**2. Cloud and sweep.** Lit points rise in depth according to their brightness and form the cloud. A plane crosses it side to side, as a ring from the centre, or through depth. What it touches is split into 24 bands, low to high, sounding as a continuous additive bed. Edges under the plane add filtered noise.

**3. Procedural notes.** The generator does not depend on the sweep: it has its own clock, and the photo shapes that clock.
- **Key:** hue picks the tonic among the 12 notes. Light picks the scale: whole-tone when desaturated; Phrygian when very dark; minor pentatonic when dark; Dorian at mid light; major pentatonic when bright.
- **Progression:** the seed generates 4 chords, stepping 1 to 5 scale degrees at a time. Contrast decides whether those steps tend to be short or long.
- **Tempo:** comes from the edges, from about 40 bpm for a smooth photo to about 110 for a highly textured one. Each step is an eighth note and 8 steps make a bar. At the start of each bar the piano plays the chord root.
- **Which point sounds:** each step picks a point of the image with a golden-ratio sequence, so the whole photo is visited without repeating or clustering.
- **Sound or silence:** the chance rises with the point's light, on strong beats (steps 1 and 5) and with density. Every fourth bar thins out, like a breath.
- **Timbre and pitch:** a point on an edge sounds as bamboo. Otherwise it is a bell in the upper half and piano in the lower half. Pitch is a note of the current chord, higher the higher the point. Velocity follows the point's light and panning its horizontal position.
- **Mystery:** now and then a tension note appears, a minor second or a tritone. It happens more often in dark photos and always on the bell.

All three timbres are synthesized live, without samples. The bell uses inharmonic partials with a long tail, the piano soft FM with a hammer strike, and the bamboo a noise burst through a tuned resonator.

**Pins (v080).** An idea by Maximiliano Wille. The 88 piano keys are shared out equally among the photo's points. When a note sounds, whether from the generator, the keyboard or the drone, its points rise toward the viewer on a thin line, grow and light up, like a pin-art toy taking the mould of a hand. There are three layouts:
- **altura** (height): low at the bottom, high at the top.
- **luz** (light): low in the dark areas, high in the bright ones.
- **disperso** (scattered): each key sprinkled across the whole image.

In height and light layouts each note also nudges its neighbours, like finger pressure. Bells last longer than piano and bamboo, and the drone holds its pins while it sounds. Set it in the **Nube** window: pins, layout, pin height and tail. "Marcas" brings back the old circles.

**4. The drone.** A sustained voice of seven oscillators: body, sub, detuned saws, fifth and octave, through a filter that breathes with a slow LFO. You play it on the image, with pitch on the vertical axis and volume and brightness on the horizontal. Each extra finger adds a degree (thirds, fourths, cluster or octaves). It also plays from a MIDI keyboard, up to 4 notes at once. The **Bordón — voz** window opens its whole mix, filter, breathing, attack and release.

**5. Landscape.** An optional layer of wind, waves, tide, birds and desert, also synthesized. It is seeded from each photo's colour and texture: blues bring water, greens birds and warm tones desert.

**6. Film.** Photos go through an HP5-style black-and-white treatment with adjustable grain, contrast and vignette. Analysis runs on that version.

### Usage

1. Open `index.html` in a browser (or the hosted version) and press **sonar** (play). This starts audio and lands in edit mode with all windows.
2. Controls: side windows (sequence, analysis, spectrum, score, link) and a bottom dock (control, sound, generator, drone, drone voice).
3. Handy keys: `space` play/stop, `h` hide the interface, `f` fullscreen, `←` `→` change photo, `g` generator, `m` sweep mode.
4. **Autopilot** is on by default: it alternates images and modes hands-free.

### Your photos

Copy your `.jpg`/`.png` files into `fotos/` and list one filename per line in `fotos/listado.txt` (lines starting with `#` are ignored). With an empty list the app uses 3 generated sample images. The "quitar todas y cargar las mías" button replaces the current gallery.

### MIDI keyboard and controllers (v079)

In Chrome or Edge, open the **Enlace OSC · MIDI** window → **activar MIDI** and pick your keyboard as input.
- **Split** (default): below C4 plays the drone; above, bamboo, piano and bell by octave. "fijar corte" moves the split point.
- **Polyphonic drone:** up to 4 held notes, in free tuning or snapped to the scale.
- **Expression:** sustain pedal holds, pitch bend gives ±2 semitones and aftertouch opens the filter.
- **Knobs:** the default map follows General MIDI (1 filter, 71 resonance, 72 release, 73 attack, 74 brightness, 91 reverb). With **aprender** (learn), touch a slider and move any knob to assign it.

### OSC (Isadora, TouchDesigner, Max) (v078)

Fonoestratonika sends its notes, drone, sweep data and each photo's features, and receives control and clock. Browsers can't speak UDP, so OSC goes through a tiny dependency-free bridge (Node.js 18+):

```
node puente/puente.js --out 127.0.0.1:1234 --in 9001
```

Then open `http://localhost:8080`. The bridge serves the app and accepts several targets, such as a Tailscale IP for remote play. The full address, CC and channel map is in [`puente/LEEME.md`](puente/LEEME.md) (Spanish).

### Run it

Single file, no dependencies or build step. To auto-load `fotos/`, serve it over HTTP, with the bridge or with:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`. It works offline (Inter loads from Google Fonts only when online; otherwise Arial).

### Style

The UI follows the [`alchemy-ui`](skills/alchemy-ui/SKILL.md) skill (reusable tokens and components in `skills/alchemy-ui/`).

### Version

v080: pins (each note lifts its points in the cloud; idea by Maximiliano Wille).
v079: MIDI keyboard (polyphonic drone, split, sustain, pitch bend, aftertouch, MIDI learn) and open drone voice.
v078: OSC · MIDI link (send and receive) and OSC bridge.

---

## Créditos / Credits

Diseño, investigación y desarrollo: Héctor Cruz Juárez — https://hectorcruz.com.mx  
Colección Alchemy of Meaning.

Licencia GPL-3.0-or-later (ver `LICENSE`). / GPL-3.0-or-later license (see `LICENSE`).
