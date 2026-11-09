---
name: alchemy-ui
description: Estilo de interfaz de la colección Alchemy of Meaning de Héctor Cruz Juárez (negro, líneas finas, ventanas pequeñas, lecturas numéricas, acento verde solo para lo vivo). Úsalo al crear o actualizar la UI de cualquiera de sus artefactos web (Fonoestratonika, Belkagraph, Ezchema, Cáustika, etc.) para que compartan identidad.
---

# alchemy-ui · estilo de interfaz de la colección

Versión 1 (nov 2026). Una actualización ligera del HUD técnico en blanco y negro que ya usan los artefactos, con el contraste «suave» de aurigaQ. Misma esencia, un grado más de oficio.

Archivos de este skill: `tokens.css` (variables) y `components.css` (componentes con prefijo `a-`). Se copian dentro del artefacto, o su contenido se pega en el `<style>` del HTML cuando el artefacto es un solo archivo.

## Esencia (no se toca)

- Fondo negro; el contenido (foto, video, render) manda. La interfaz son ventanas pequeñas encima.
- Líneas de 1 px, sin sombras, rótulos chicos, lecturas numéricas con valor real.
- Medidores, retícula con `mix-blend-mode:difference`, marco de esquinas con cifras, dock inferior.
- Todo se opera con teclado; `h` oculta la interfaz y un botón discreto `▪` la recupera.
- En móvil las columnas pasan a un cajón; respetar `env(safe-area-inset-*)`.

## Qué cambia respecto a la versión anterior (blanco puro)

| Antes | Ahora |
|---|---|
| Barra de título blanca sólida | `--a-bar` gris oscuro, texto `--a-ink` |
| Bordes `#fff` | `--a-line` (ventanas) y `--a-line-ctl` (controles) |
| Activo = inversión blanco/negro | Activo = `--a-accent-bg` + borde y texto de acento |
| Medidor ■□ | `.a-meter`: barra de 3 px con relleno de acento |
| Deslizador de línea blanca | Línea de 2 px con relleno de acento, tirador de 6×14 |
| Esquinas rectas | Radio de 3 px (2 px en filas) |
| Arial 11 px | Inter (Arial de respaldo) 12 px, cifras tabulares |

## Reglas de uso

1. **El verde `--a-accent` es solo para lo vivo o principal:** sonar/detener, modo o alternador activo, elemento seleccionado, progreso, cabeza de lectura. Nunca decoración.
2. **Segmentados:** el activo va en tinta clara (`--a-ink`), no en verde.
3. **Etiqueta tenue, valor claro:** `.a-lbl` para el rótulo, `.a-val` para la cifra.
4. **Una sola barra de scroll:** nunca la nativa clara; usar `.a-scroll` o `.a-scroll-hidden` (con flechas o difuminado de borde como pista).
5. **Contraste mínimo 4.5:1** en texto, también en rótulos de 11 px. Los valores de `tokens.css` ya lo cumplen; si se cambia el acento, comprobarlo.
6. **Contraste «alto»** opcional con `<html data-contrast="alto">` para pantallas con mucha luz; vuelve al blanco sobre negro.
7. **Transiciones de 120 ms solo en color y borde;** nada de rebotes ni sombras.
8. **Estados con `aria-pressed` / `aria-selected`,** no clases sueltas, para que teclado y lectores de pantalla funcionen.
9. **Foco visible:** contorno de 2 px en acento (ya incluido).
10. Minúsculas o mayúscula inicial; sin versalitas salvo rótulos de sección.

## Cómo aplicarlo a un artefacto existente

1. Copiar `tokens.css` y `components.css` junto al HTML (o pegarlos en `<style>`).
2. Añadir la clase `a-ui` al `<body>` y cargar Inter desde Google Fonts si hay red; sin red cae a Arial.
3. Migrar en este orden, probando entre pasos: tokens → ventanas (`.win`→`.a-win`, `.tb`→`.a-tb`, `.wb`→`.a-wb`) → botones (`.b`→`.a-btn`, `.seg`→`.a-seg`) → deslizadores → medidores → filas con miniatura.
4. Reemplazar `■□` por `.a-meter` con `--v` entre 0 y 1.
5. Revisar que el contenido siga mandando: ninguna ventana debe tapar el centro de la escena por defecto.
6. Mantener la tipografía y el color de lo que sea contenido (foto, video, render): el acento no se aplica allí.

## Cambiar el acento por artefacto

La colección usa el verde `#76c411` (el de hectorcruz.com.mx y aurigaQ). Si un artefacto necesita otro acento, cambiar solo `--a-accent`, `--a-accent-ink` y `--a-accent-bg` (fondo muy oscuro del mismo matiz) y comprobar el contraste.

## Créditos que acompañan al estilo

"Diseño, investigación y desarrollo: Héctor Cruz Juárez — https://hectorcruz.com.mx" y "Colección Alchemy of Meaning." La marca se escribe «Alchemy of Meaning» sin traducción dentro de las apps.
