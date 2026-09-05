# Sistema v2: contrato para quien escriba componentes

Este archivo manda. Si algo acá contradice tu intuición, gana esto.

## Qué cambió respecto de la v1 y por qué

Juan vio la primera versión (hueso claro, editorial, quieta) y pidió otra cosa:
**"muy visual", que quien entre diga "wow", que sirva para que una empresa lo quiera
contratar, y que muestre TODOS sus proyectos, no solo Rienda.** Pidió además usar
componentes reales del catálogo de 21st.dev, como ya hizo en Mucho Peluquería.

Entonces la v2 es **noche profunda, capturas enormes, movimiento con presencia**.
El jade dejó de ser un acento tímido y ahora brilla. Sigue siendo un solo acento.
La tipografía no cambia: Schibsted Grotesk y JetBrains Mono ya tienen carácter.

Lo que NO cambió: cero datos inventados, cero métricas falsas, cero testimonios,
sin guiones largos visibles, accesibilidad no negociable, `prefers-reduced-motion`
respetado en todo.

## Stack y reglas duras

- Next.js 16 App Router, React 19, TypeScript estricto, Tailwind CSS v4.
- Motion se importa de `motion/react`. GSAP solo donde ya estaba (escena Rienda) si se conserva.
- shadcn está configurado (`components.json`); `cn` en `@/lib/utils` es la firma estándar (clsx + tailwind-merge).
- **No instales dependencias nuevas.** Las que hay: motion, gsap, clsx, tailwind-merge, @tabler/icons-react (vino con macbook-scroll; ver abajo).
- Componentes de servidor por defecto. Los componentes del catálogo son `"use client"`; envolvelos desde un componente de servidor que les pase datos ya resueltos.
- Imágenes con `next/image` y `sizes` correcto. Los componentes del catálogo traen `<img>`: al adaptarlos, pasalos a `next/image` cuando reciben `width/height` conocidos; si el componente necesita `<img>` crudo por cómo mide (3D marquee, hero parallax), dejalo y justificalo con `// eslint-disable-next-line @next/next/no-img-element` más una línea de porqué.
- Enlaces externos: `target="_blank" rel="noopener noreferrer"`.
- **Nunca escribas copy de negocio nuevo.** Sale de `src/content/*`. Los rótulos estructurales (encabezado de sección, texto de un botón) sí se pueden escribir en el componente.

## Paleta v2 (tokens en `src/app/globals.css`)

| Token Tailwind | Uso |
|---|---|
| `bg-night-900` | fondo del sitio (`#0f110e`) |
| `bg-night-950` | zonas más hundidas, detrás de una escena |
| `bg-night-800` / `bg-night-700` | superficies, tarjetas, marcos de pantalla |
| `text-paper` | texto principal |
| `text-paper-muted` | secundario (8:1) |
| `text-paper-faint` | metadata (4,8:1, no bajar de acá para texto) |
| `text-jade` / `bg-jade` | **el único acento**. 5,5:1 sobre noche: sirve para texto |
| `bg-jade-deep`, `bg-jade-ink` | rellenos jade oscuros |
| `text-jade-glow` / `bg-jade-glow` | solo brillos, degradados y texto grande (no pasa AA en cuerpo) |
| `bg-bone-100` + `text-ink*` | paneles claros puntuales; llevan `data-surface="bone"` en el contenedor |

Hairlines: `var(--hairline)`, `var(--hairline-strong)` (ya son de papel sobre noche).
Utilidades: `hairline-t/b/l`, `.shell`, `.grid12`, `.meta`, `.measure`, `.measure-wide`.

Nuevas en v2:
- `.screen`: marco estándar de toda captura de producto (radio, fondo night-800, sombra profunda). **Toda captura va dentro de un `.screen`** salvo que el componente del catálogo ya la enmarque.
- `.text-glow`: degradado jade sobre texto. **Una palabra o frase corta por titular**, nunca un párrafo.
- `.halo`: velo radial jade detrás de una escena (`position:absolute; inset:0`). El padre necesita `relative` y `overflow-hidden`.
- `.noise`: grano sutil para fondos grandes.
- `shadow-glow`, `shadow-glow-sm`, `shadow-screen`: utilidades de sombra.
- `--color-*` de cada proyecto: `project.accent` (hex real de la marca del producto). Se usa solo para el halo detrás de sus capturas y el borde de su tarjeta, vía `style={{ "--accent": project.accent }}` y `color-mix(in oklab, var(--accent) 30%, transparent)`.

Tipografía: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-lead`, `text-body`, `text-micro`, `text-meta`. Display ahora llega a 8rem.

`<html class="dark">` está puesto: los `dark:` de los componentes del catálogo se activan. Igual hay que reemplazar sus colores por los tokens.

## Componentes del catálogo de 21st.dev ya instalados (`src/components/ui/`)

Bajados con `npx shadcn add <registro>` desde los registros públicos de sus autores
(los mismos componentes que lista 21st.dev; el registro de 21st.dev pide cuenta).
**Se adaptan en el lugar.** Cada archivo adaptado lleva arriba un comentario con:
autor y fuente, dónde se usa, y qué se cambió del original. Mirá
`C:\Users\Usuario\Claude\mucho-peluqueria\components\ui\3d-marquee.tsx` como modelo
de ese comentario: es el que hizo Juan en su propio proyecto.

| Archivo | Autor (21st.dev) | Export y props clave | Dueño en esta ronda |
|---|---|---|---|
| `hero-parallax.tsx` | Manu Arora, Aceternity | `HeroParallax({ products: {title, link, thumbnail}[] })`, exporta también `Header` y `ProductCard` | hero |
| `spotlight-new.tsx` | Aceternity | `Spotlight({ gradientFirst, gradientSecond, gradientThird, translateY, width, height, smallWidth, duration, xOffset })` | hero |
| `dot-pattern.tsx` | Magic UI | `DotPattern({ width, height, cx, cy, cr, glow, className })` | hero |
| `text-generate-effect.tsx` | Aceternity | `TextGenerateEffect({ words, className, filter, duration })` | hero |
| `word-rotate.tsx` | Magic UI | `WordRotate({ words, duration, motionProps, className })` | hero |
| `marquee.tsx` | Magic UI | `Marquee({ reverse, pauseOnHover, vertical, repeat, children })` | stack |
| `focus-cards.tsx` | Aceternity | `FocusCards({ cards: {title, src}[] })`, exporta `Card` | proyectos |
| `shine-border.tsx` | Magic UI | `ShineBorder({ borderWidth, duration, shineColor })` (se pone dentro de un padre `relative`) | proyectos |
| `lens.tsx` | Aceternity | `Lens({ zoomFactor, lensSize, isStatic, hovering, setHovering, children })` | proyectos |
| `3d-marquee.tsx` | Aceternity | `ThreeDMarquee({ images: string[], className })` | proyectos |
| `macbook-scroll.tsx` | Aceternity | `MacbookScroll({ src, showGradient, title, badge })` | rienda |
| `sticky-scroll-reveal.tsx` | Aceternity | `StickyScroll({ content: {title, description, content?}[], contentClassName })` | como-trabajo |
| `container-scroll-animation.tsx` | Aceternity | `ContainerScroll({ titleComponent, children })` | caso |
| `timeline.tsx` | Aceternity | `Timeline({ data: {title, content}[] })` | recorrido |
| `moving-border.tsx` | Aceternity | `Button({ borderRadius, as, containerClassName, borderClassName, duration, children })`, `MovingBorder` | contacto |
| `background-beams.tsx` | Aceternity | `BackgroundBeams({ className })` | contacto |
| `hover-border-gradient.tsx` | Aceternity | `HoverBorderGradient({ as, containerClassName, className, duration, clockwise })` | ia |
| `blur-fade.tsx` | Magic UI | `BlurFade({ delay, duration, offset, direction, inView, inViewMargin, blur, children })` | compartido: usalo, no lo edites; lo adapta el agente "ia" |

Estado al instalarlos: `tsc` falla solo en `moving-border.tsx:85` (`useRef()` sin
argumento; poné `useRef<SVGRectElement | null>(null)`). ESLint marca `any`,
`setState` dentro de efectos, refs leídos en render y `<img>`. **Quien es dueño del
archivo lo deja limpio**: sin `any`, sin `eslint-disable` salvo el de `<img>` justificado.

`macbook-scroll.tsx` importa seis iconos de `@tabler/icons-react` para dibujar
teclas. Reemplazalos por texto o SVG inline y **sacá el import**; al final de la
ronda se desinstala ese paquete.

Mucho Peluquería ya tiene adaptados `3d-marquee.tsx` y `focus-cards.tsx`
(`C:\Users\Usuario\Claude\mucho-peluqueria\components\ui\`). Leelos: muestran cómo
Juan quiere que se adapte un componente (paleta propia, comentario de qué cambió).
No copies su paleta (es negra y de otro producto), copiá el criterio.

## Composición v2 de la home (en orden)

1. **Hero** (`sections/hero.tsx`): `HeroParallax` con quince capturas reales de los cinco proyectos en tres filas que se mueven con el scroll. En el `Header` del componente va: rótulo, el título en `text-display` con una palabra en `.text-glow`, la bajada, los dos botones, y el retrato chico. `Spotlight` barriendo detrás, `DotPattern` muy tenue. Un solo `h1`.
2. **Franja de stack** (`sections/stack-marquee.tsx`): `Marquee` con las tecnologías y disciplinas de `capabilities`, en `.meta` grande, con hairlines arriba y abajo, `pauseOnHover`.
3. **Proyectos** (`sections/projects.tsx`): la sección más importante. Cinco proyectos, del contenido. Un destacado arriba (el primero de `projects`, hoy Rienda) con `ShineBorder` y `Lens` sobre su captura; los otros cuatro en `FocusCards` adaptado para llevar nombre, tipo (`kind`), una línea y enlace al caso. Cada tarjeta lleva `--accent` del proyecto en su borde y halo. Cierra con **el muro**: `ThreeDMarquee` con todas las capturas de todos los proyectos, a sangre, con un titular corto encima.
4. **Rienda por dentro** (`sections/rienda-feature.tsx`): `MacbookScroll` con la pantalla Vender abriéndose al hacer scroll, y debajo un resumen corto de las áreas con las otras capturas en una tira. Es UNA de las cinco, no la dueña del sitio: ocupa menos que antes.
5. **Cómo trabajo** (`sections/how-i-work.tsx`): `StickyScroll` con los cinco pasos del proceso de `aiSection.steps` y, en el panel fijo, **una captura de un proyecto distinto por paso** (evidencia real, no íconos). El texto de `howIWork` va como apertura.
6. **IA como herramienta** (`sections/ai-work.tsx`): apertura con `aiSection.title` y `.text-glow`; el cierre (`aiSection.closing`) dentro de un `HoverBorderGradient`. `BlurFade` para las entradas.
7. **Recorrido** (`sections/experience.tsx`): `Timeline` adaptado, con los dos roles y, dentro de cada uno, las responsabilidades y la captura del proyecto asociado si lo tiene.
8. **Formación y capacidades** (`sections/education.tsx`, `sections/capabilities.tsx`): noche, hairlines, `BlurFade`. Sin tarjetas de texto.
9. **Contacto** (`sections/contact.tsx`): `BackgroundBeams` detrás, titular enorme, botón primario con `moving-border` `Button`.
10. Footer oscuro.

Páginas:
- `/proyectos/[slug]`: `ContainerScroll` con la portada como pantalla que se endereza al hacer scroll; ficha técnica; bloques; galería con `Lens` en cada imagen. `SharedElement` en portada y nombre como hasta ahora.
- `/proyectos`: grilla `FocusCards` de los cinco con filtro por `kind` (tres botones, sin librería).
- `/cv`: se queda como está en estructura; en pantalla pasa a noche. La impresión sigue en blanco y negro.

## Reglas de movimiento v2

1. Solo `transform`, `opacity` y `filter: blur` (este último solo en entradas cortas).
2. Los componentes del catálogo ya usan `useScroll`/`useTransform`; no agregues listeners manuales.
3. `MotionConfig reducedMotion="user"` sigue en el layout. Los efectos que dependen de `useScroll` o de estilos calculados no lo respetan solos: usá `useReducedMotion()` y devolvé la versión estática (imagen fija, texto visible).
4. Todo lo que anima al entrar debe ser legible si la animación no corre: `BlurFade` ya lo hace bien; `TextGenerateEffect` deja el texto en el DOM.
5. Nada infinito salvo `Marquee` y `ThreeDMarquee`, que son la excepción justificada (y pausan al pasar el puntero o con movimiento reducido).
6. Nada de cursores personalizados. El `Spotlight` no es un cursor.

## Prohibido

- Métricas, clientes, testimonios, premios o resultados inventados. **Cero.**
- Guiones largos visibles en texto (ni em dash ni en dash).
- Degradados violetas o azules. Los degradados son jade sobre noche y nada más.
- Secciones numeradas 01/02/03. Indicadores que digan "Scroll".
- Frases vacías tipo "creando experiencias digitales".
- Abusar de `.meta` (una por sección).
- Tres tarjetas iguales en fila con solo texto. Las tarjetas acá llevan capturas.

## Accesibilidad

- Un solo `h1` por página, jerarquía sin saltos, `aria-labelledby` en cada `section[id]`.
- `alt` real en cada captura (viene del contenido). Las decorativas duplicadas (muro 3D, parallax) llevan `alt=""` y `aria-hidden` en el contenedor, con el mismo contenido disponible en texto en otra parte de la página.
- Todo lo clickeable es `<a>` o `<button>`. Foco visible (ya es jade-glow).
- Contraste: paper-faint es el piso para texto sobre noche.

## Verificación

`npm run typecheck`, `npm run lint`, `npm run test` y `npm run build` en verde.

## Móvil vivo (ronda 3)

Juan vio la v2: en computadora le encanta. En el teléfono no: "la necesito más viva",
porque la mayoría de la gente va a entrar desde LinkedIn en el celular. Y el muro de
"todas las pantallas" en móvil se ve medio negro y medio pantallas.

Diagnóstico a 390 px: el hero pasa a una grilla estática de cuatro miniaturas, las
tarjetas de proyectos no reaccionan a nada porque su efecto depende de `hover`, el
muro 3D queda descentrado, la tira de áreas de Rienda muestra marcos vacíos (bug),
y "cómo trabajo" es una lista quieta. Lo único que se mueve es la franja de stack, la
entrada del título y el riel del timeline.

### Principios para el tacto

1. **En el teléfono el único gesto es bajar.** Todo lo que en escritorio pasa con el
   puntero tiene que pasar con el scroll o solo: parallax atado al scroll, marquesinas
   que derivan solas, entradas al aparecer, y "foco" para el elemento que está en el
   centro de la ventana.
2. **Primitivo compartido:** `ScrollParallax` en `@/components/primitives/scroll-parallax`.
   `<ScrollParallax range={[-30, 30]}>` desplaza al hijo en vertical mientras cruza la
   ventana. Usalo para que las capturas floten dentro de su `.screen` (el marco con
   `overflow-hidden`, el hijo un 12% más alto). No lo edites: si necesitás otra cosa,
   escribí la tuya al lado.
3. **Foco por posición:** el elemento más cerca del centro de la ventana se enciende
   (borde con `--accent`, opacidad 1) y los demás bajan a 0,7. Con `useInView` de
   Motion (`amount: 0.6`) por tarjeta o con un `IntersectionObserver` propio.
   Solo debajo de `lg`; en escritorio sigue mandando el hover.
4. **Marquesinas verticales** para el hero y el muro en móvil: dos o tres columnas
   de capturas que derivan en sentidos opuestos (el `Marquee` de Magic UI acepta
   `vertical`). Con desvanecido en los bordes (`mask-image`), pausa con movimiento
   reducido. Es la excepción al "nada infinito" ya prevista para marquesinas.
5. **Todo `transform` y `opacity`.** Nada de `filter: blur` animado en móvil: cuesta
   caro en teléfonos. Los `BlurFade` de entrada están bien (son cortos y una vez).
6. **Rendimiento:** `next/image` con `sizes` real para 390 px, sin cargar variantes
   de escritorio; nunca más de dos marquesinas corriendo a la vez en pantalla.
7. **Escritorio no se toca.** Todo lo de esta ronda va detrás de `max-lg:` o de
   ramas condicionales por ancho; lo que se ve en 1440 tiene que quedar igual.
8. Los mismos límites de siempre: cero copy inventado, sin guiones largos, `alt`
   real, un `h1`, reducido respetado.
