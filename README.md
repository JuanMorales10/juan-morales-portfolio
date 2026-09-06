# Portfolio de Juan Morales

Portfolio y CV online. Next.js 16 con App Router, React 19, TypeScript estricto,
Tailwind CSS v4, Motion y componentes del catálogo de 21st.dev adaptados a mano.

Es un proyecto independiente. No comparte nada con los repositorios de los
productos que muestra.

---

## Arrancar

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:3000`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción |
| `npm start` | sirve el build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest, verifica el contenido |

---

## Qué hay

Una home en noche profunda con cinco proyectos reales, cada uno con su caso de
estudio, más un CV imprimible.

| Ruta | Qué es |
|---|---|
| `/` | hero con las capturas de los cinco proyectos en parallax, franja de stack, presentación, proyectos (destacado con lupa, tarjetas con foco y el muro 3D con todas las pantallas), Rienda por dentro con la notebook que se abre al hacer scroll, cómo trabajo con panel fijo y una captura por paso, IA, recorrido, formación, capacidades y contacto |
| `/proyectos` | índice con filtro por tipo: producto propio, para un cliente, herramienta interna |
| `/proyectos/rienda`, `/proyectos/llavero`, `/proyectos/mucho-peluqueria`, `/proyectos/portal-poltrona`, `/proyectos/ahorrito` | casos de estudio: problema, visión, participación, decisiones, áreas y galería con lupa |
| `/cv` | CV en pantalla (noche) e imprimible en A4 (blanco y negro, dos hojas, URL de cada enlace impresa) |

---

## Editar el contenido

**Todo el texto vive en `src/content`.** Los componentes no tienen copy adentro: lo
reciben tipado.

| Archivo | Qué controla |
|---|---|
| `src/content/site.ts` | dominio, correo, GitHub, LinkedIn, navegación y la lista de pendientes |
| `src/content/profile.ts` | hero y presentación |
| `src/content/experience.ts` | roles, formación e idiomas |
| `src/content/capabilities.ts` | los cuatro grupos de capacidades (también alimentan la franja de stack) |
| `src/content/approach.ts` | "Cómo trabajo" y "IA como herramienta de trabajo" |
| `src/content/projects/*.ts` | un archivo por proyecto |
| `src/content/projects/index.ts` | el registro y el orden |
| `src/content/types.ts` | los tipos de todo lo anterior |

### El CV que se descarga

El botón de `/cv` baja un archivo real: `public/Juan-Morales-CV.pdf`. No se genera
en cada visita ni lo dibuja una librería: lo imprime Chrome desde la misma página,
así que el texto sale seleccionable y en el orden del documento, que es lo que
necesita leer un sistema de recursos humanos. Sale en una sola columna a propósito:
las de dos y tres columnas se leen intercaladas cuando el que extrae el texto va
por posición y no por documento.

```bash
npm run cv:pdf
```

Compila, levanta el sitio en el puerto 3100, imprime y deja el PDF junto a su huella
en `src/content/cv-pdf.json`. Después hay que commitear los dos archivos.

**`npm run build` se corta si el contenido del CV cambió y el PDF quedó viejo.** Es a
propósito: el archivo que se baja una empresa no puede decir algo distinto que la
página. El mensaje del error dice qué correr.

### Los proyectos

| Slug | Qué es | Tipo | Fuente del contenido |
|---|---|---|---|
| `rienda` | plataforma integral para comercios | producto propio | brief de Juan y capturas que él preparó |
| `llavero` | gestión para inmobiliarias | producto propio | repo `propia`: README, docs, git |
| `mucho-peluqueria` | turnos con web, bot de WhatsApp y panel | para un cliente | repo `mucho-peluqueria`; capturas tomadas del sitio corriendo en local |
| `portal-poltrona` | presupuestos y gestión comercial, cifrado en el navegador | herramienta interna | repo `poltrona-portal`; capturas del portal servido en local |
| `ahorrito` | finanzas personales con "cerebro" de IA | producto propio | historial de git de `propia` y `ahorrito-negocios`; capturas de `propia/docs/screenshots` |

Cada proyecto declara `kind`, `client` (si aplica), `accent` (el color real de su
marca, que solo se usa para el halo detrás de sus capturas), `start` y `end`.

### Sumar un proyecto

1. Crear `src/content/projects/mi-proyecto.ts` copiando la forma de `rienda.ts`.
2. Importarlo en `src/content/projects/index.ts` y agregarlo a `registry`.
3. Dejarlo en `status: "draft"` mientras se escribe.

Un proyecto en `draft` **se ve en desarrollo y no existe en producción**: ni en la
home, ni en `/proyectos`, ni en el sitemap, ni con página propia. El hero, el muro y
el panel de "cómo trabajo" toman sus capturas solos de `cover`, `areas` y `gallery`.

### Datos que faltan

Los valores entre corchetes en `site.ts` son marcadores. En desarrollo se ven
señalados; en producción no se renderizan, así que **el sitio nunca publica un dato
falso ni un enlace roto**. La lista viva está en `pendingAssets`, dentro de
`src/content/site.ts`. Hoy:

- Dominio propio (`NEXT_PUBLIC_SITE_URL`). Hoy apunta a la URL de Vercel; Juan lo cambia cuando tenga el dominio.
- Nombre real de la empresa de Barcelona (enero a noviembre de 2024). Hasta que esté, ese puesto no se publica.
- Si el teléfono va en el CV público.
- Entre noviembre de 2024 y febrero de 2026 Juan estuvo parado en tecnología. Hoy el CV muestra ese hueco sin explicarlo.
- Confirmar la emisión del certificado de IA: el diploma dice 31 de julio de 2024 y el brief decía agosto.

### Un archivo que quedó afuera a propósito

`docs-brief/privado/certificado-ia-CONTIENE-NIF.jpg` es el certificado original.
**No está en `public/` y no se publica**: incluye el nombre legal completo y un número
de identificación personal. La certificación sí figura como dato.

---

## Configuración

Copiar `.env.example` a `.env.local` y definir `NEXT_PUBLIC_SITE_URL` con el dominio
definitivo antes de publicar. Sin esa variable el sitio usa un dominio provisional para
canonical, Open Graph y sitemap.

---

## Sistema visual

`docs-brief/SISTEMA.md` es el contrato: paleta, tipografía, reglas de movimiento,
prohibiciones y la composición de cada sección. Resumen:

- **Noche y papel.** Fondo `#0f110e` con un tinte verde apenas perceptible, texto en papel `#f2f3ee`. Las capturas de producto van en un marco `.screen` con sombra profunda: sobre noche, una pantalla clara se lee como una lámpara.
- **Un solo acento.** Jade `#2a9a82` (5,5:1 sobre noche, sirve para texto) y `jade-glow` `#4fd1b3` solo para brillos y una palabra por titular (`.text-glow`).
- **Tipografía.** Schibsted Grotesk para todo el discurso y JetBrains Mono para metadata.
- **Color por proyecto.** Cada proyecto trae el hex real de su marca en `accent`; se usa para el halo detrás de sus capturas y el borde de su tarjeta, nunca como texto.
- **Movimiento.** `transform`, `opacity` y desenfoques cortos de entrada. `MotionConfig reducedMotion="user"` envuelve el árbol; los efectos que dependen de `useScroll` consultan `useReducedMotion()` y muestran la versión estática. Los únicos bucles son las marquesinas, que pausan con el puntero y con movimiento reducido.
- **Sin JavaScript** el sitio se ve entero: `NoScriptFallback` neutraliza los estados iniciales de las animaciones.
- **El teléfono está vivo por su cuenta.** En una pantalla táctil no hay puntero, así que debajo de `lg` todo lo que en escritorio pasa con hover pasa con el scroll o solo: columnas de capturas que derivan en el hero y en el muro (`Marquee` vertical), tarjetas que se encienden al llegar al centro de la ventana, la pantalla de Rienda que se endereza al bajar, capturas que flotan con `ScrollParallax` (`src/components/primitives/scroll-parallax.tsx`) y una barra de progreso de lectura bajo la navegación. El escritorio no cambia.

---

## Componentes de 21st.dev

Juan pidió usar el catálogo de 21st.dev, como en Mucho Peluquería. El registro de
21st.dev pide cuenta, pero los componentes que lista son de Aceternity UI y Magic UI,
cuyos registros son públicos: se bajaron de ahí con `npx shadcn add <url>` y **se
adaptaron en el lugar** (paleta, `next/image`, tipos, lint, movimiento reducido).
Cada archivo de `src/components/ui/` lleva arriba el autor, la fuente y qué se cambió.

| Componente | Autor | Dónde se usa |
|---|---|---|
| Hero Parallax | Aceternity | hero: quince capturas de los cinco proyectos en tres filas |
| Spotlight, Dot Pattern | Aceternity, Magic UI | fondo del hero |
| Text Generate Effect | Aceternity | titular del hero |
| Marquee | Magic UI | franja de stack |
| Shine Border, Lens | Magic UI, Aceternity | proyecto destacado |
| Focus Cards | Aceternity | tarjetas de proyectos e índice |
| 3D Marquee | Aceternity | el muro con todas las pantallas |
| Macbook Scroll | Aceternity | Rienda por dentro |
| Sticky Scroll Reveal | Aceternity | cómo trabajo, con una captura de un proyecto distinto por paso |
| Blur Fade, Hover Border Gradient | Magic UI, Aceternity | entradas y el cierre de la sección de IA |
| Timeline | Aceternity | recorrido |
| Moving Border, Background Beams | Aceternity | contacto |
| Container Scroll Animation | Aceternity | portada de cada caso de estudio |

Dependencias de producción: `next`, `react`, `react-dom`, `motion`, `clsx`,
`tailwind-merge`. Nada más.

---

## Verificación

`npm run typecheck`, `npm run lint`, `npm run test` (14 pruebas: slugs únicos,
proyectos publicados completos, imágenes existentes, sin guiones largos, sitemap
coherente) y `npm run build` (20 rutas, todas estáticas) en verde. Revisión visual
con Chrome headless en 1440 x 900 y 390 x 844 sobre el build de producción.

## Publicar

Anda en Vercel sin configuración: importar el repositorio, definir
`NEXT_PUBLIC_SITE_URL` y listo. Antes:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```
