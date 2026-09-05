# Encargo: portfolio y CV online de Juan Morales

Quiero que diseñes e implementes desde cero mi portfolio profesional y CV online.

## Separación del proyecto

Este portfolio debe vivir en un proyecto independiente, por ejemplo `juan-morales-portfolio`.

No modifiques el repositorio de Rienda ni mezcles este sitio con el producto. Si estás parado dentro de ese repositorio, detenete y creá el portfolio en una carpeta hermana o pedime una ruta nueva.

Leé también `LEEME-PRIMERO.md` e `INVENTARIO-DE-RECURSOS.md` antes de implementar.

## Objetivo

No quiero un portfolio genérico de desarrollador ni una plantilla con tarjetas, degradados violetas y texto vacío.

Quiero una experiencia digital de alto nivel, visualmente memorable y con una calidad cercana a un sitio de Awwwards, pero rápida, profesional, accesible y fácil de recorrer.

El resultado debería provocar esta impresión:

> Esta persona entiende producto, tecnología, diseño e inteligencia artificial, y sabe combinarlos para construir soluciones reales.

La inteligencia artificial no debe aparecer como una frase de moda. Debe percibirse en la calidad del sitio, la narrativa, las interacciones, la presentación de los proyectos y una sección concreta sobre cómo la utilizo.

Actuá como diseñador de producto, director de arte, motion designer, redactor e ingeniero frontend senior. Tomá decisiones con autonomía. No consultes detalles visuales menores.

Antes de programar, mostrame solamente:

1. Una línea de Design Read que resuma audiencia, objetivo, tono visual y dirección.
2. La arquitectura de información propuesta.
3. Las decisiones visuales principales.
4. Las animaciones elegidas y qué función cumple cada una.

Después implementá el sitio completo. No te quedes en un wireframe o una propuesta conceptual.

## Datos profesionales

Nombre: Juan Morales.

Ubicación: Mendoza, Argentina.

Posicionamiento: Cofundador y CEO de Rienda. Producto, desarrollo, inteligencia artificial y estrategia aplicados a problemas reales de negocio.

LinkedIn: https://www.linkedin.com/in/juan-morales1/

Rienda: https://rienda.ar

Contacto: centralizar en un archivo de configuración y utilizar `[EMAIL_PERSONAL]` hasta recibir el correo definitivo.

## Copy inicial del hero

Título:

> Convierto ideas y operaciones complejas en productos digitales que funcionan.

Descripción:

> Cofundador de Rienda. Producto, desarrollo e inteligencia artificial aplicados a problemas reales de negocio.

Ubicación secundaria: Mendoza, Argentina.

CTA principal: Ver proyectos.

CTA secundario: Conocer mi recorrido.

Podés mejorar la redacción, pero no cambiar el significado ni inventar resultados.

## Perfil profesional

Soy Juan Morales, cofundador y CEO de Rienda, una plataforma integral para comercios argentinos.

Rienda conecta ventas, caja, stock, facturación electrónica con ARCA, clientes, proveedores, equipos, sucursales, canales online, WhatsApp, reportes e inteligencia artificial aplicada.

Su diferencial es que toda la operación trabaja conectada. Una venta puede actualizar caja y stock, generar una factura, alimentar reportes y sincronizar los distintos canales del comercio.

En Rienda participo en estrategia de producto, experiencia de usuario, arquitectura, desarrollo, integraciones, seguridad y operación del producto SaaS. Trabajo en Rienda desde febrero de 2026.

También soy responsable de Tecnología y Marketing en Poltrona de Interiores desde mayo de 2026. Coordino decisiones tecnológicas, mejoras digitales y el trabajo con la agencia externa de marketing. Participo en la definición de objetivos, planes, reuniones, seguimiento y estrategia.

## Formación

- Digital House. Full Stack Web Development. Abril de 2023 a noviembre de 2023.
- Egg Cooperation / Egg Live. Full-Stack Developer. Septiembre de 2021 a noviembre de 2022. Calificación: 91.
- Fundación Esplai / Talent IT. IA: Bases, Prompt Engineering, RAG y Fine-Tuning. Emitido en agosto de 2024. Duración: 150 horas.

## Capacidades

Organizarlas en grupos claros. No crear una nube interminable de etiquetas.

Producto:

- Estrategia de producto.
- Investigación y definición de problemas.
- Diseño de experiencias.
- Priorización.
- Operación SaaS.

Desarrollo:

- Next.js.
- React.
- TypeScript.
- PostgreSQL.
- Prisma.
- Arquitectura de aplicaciones.
- Integraciones.
- Seguridad.

Inteligencia artificial:

- Prompt Engineering.
- RAG.
- Fine-Tuning.
- Automatización de procesos.
- Aplicación de IA a producto, desarrollo y operación.

Negocio y crecimiento:

- Marketing digital.
- Transformación digital.
- Coordinación con agencias.
- Estrategia comercial.
- Análisis de operaciones.

## Proyectos

Rienda debe ser el caso de estudio principal y el proyecto visualmente más importante.

Crear una página individual `/proyectos/rienda` que explique:

- El problema de tener ventas, caja, stock, facturación y canales separados.
- La visión de una operación totalmente conectada.
- Mi participación en producto, desarrollo, UX, arquitectura, integraciones y operación.
- Las principales áreas del sistema.
- El stack tecnológico.
- Las decisiones y aprendizajes más relevantes.
- Enlace a https://rienda.ar.

Usar las capturas reales incluidas en `rienda/capturas-producto/`. Nunca inventar dashboards, métricas, clientes, testimonios o resultados.

Crear una estructura de datos reutilizable para sumar proyectos independientes posteriormente. Los proyectos incompletos no deben mostrarse en producción.

## Arquitectura del sitio

1. Navegación mínima y fija.
2. Hero asimétrico con la fotografía profesional incluida y una composición visual fuerte.
3. Presentación breve.
4. Caso destacado de Rienda.
5. Proyectos seleccionados.
6. Sección Cómo trabajo, combinando producto, tecnología, negocio e IA.
7. Experiencia profesional.
8. Formación y certificaciones.
9. Stack y capacidades.
10. Contacto.
11. Footer simple.
12. Página `/cv`, optimizada para imprimir y exportar a PDF.
13. Páginas individuales para casos de estudio.

Agregar descarga de CV en PDF, pero mantener el portfolio como experiencia principal.

## Dirección visual

- DESIGN_VARIANCE: 9/10.
- MOTION_INTENSITY: 8/10.
- VISUAL_DENSITY: 4/10.

Quiero una dirección editorial tecnológica, sofisticada y humana.

Usar:

- Grilla asimétrica de 12 columnas.
- Mucho control del espacio y la jerarquía tipográfica.
- Base clara mineral o hueso.
- Texto casi negro.
- Un único color de acento verde petróleo o jade profundo.
- Una sans distintiva y una monoespaciada solamente para metadata.
- Bordes, radios y espaciados consistentes.
- Fotografía y capturas reales como protagonistas.
- Composiciones diferentes entre secciones.

La identidad personal puede dialogar con Rienda, pero no debe parecer otra landing comercial de la marca.

Evitar completamente:

- Fondo oscuro con degradados violetas o azules.
- Mesh gradients genéricos.
- Glassmorphism por todas partes.
- Tres tarjetas iguales en una fila.
- Bento grids llenos solamente de texto.
- Falsas terminales de programación.
- Cursores personalizados.
- Métricas inventadas.
- Testimonios ficticios.
- Stock photos genéricas.
- Frases vacías como “creando experiencias digitales”.
- Abusar de etiquetas pequeñas en mayúsculas.
- Numerar secciones como 01, 02 o 03.
- Indicadores que digan Scroll.
- Animaciones decorativas infinitas.
- Guiones largos visibles en los textos.

## Uso de 21st.dev

Consultar el catálogo actual de 21st.dev y elegir solamente entre dos y cuatro componentes que aporten a la experiencia.

Posibles usos:

- Navegación con transición.
- Presentación visual de proyectos.
- Timeline de experiencia.
- Interacción especial del hero.
- Galería de imágenes.
- Transición entre un proyecto y su caso de estudio.

No pegar componentes sin modificarlos. Cada componente debe adaptarse profundamente al sistema visual del portfolio: colores, tipografía, espaciado, movimiento, accesibilidad y comportamiento responsive.

No mezclar varias bibliotecas visuales sin criterio. El sitio debe sentirse diseñado como un único producto.

## Movimiento y animaciones

Motion debe ser la biblioteca principal para las interacciones y animaciones de interfaz.

Usar:

1. Entrada del hero con stagger. El título, descripción, CTA e imagen aparecen en secuencia.
2. Scroll reveal sutil al entrar en el viewport.
3. Parallax moderado sobre la fotografía o algunos recursos visuales.
4. Scroll-driven storytelling en la sección de Rienda, con una composición sticky que muestre capturas reales mientras se explican áreas del producto.
5. Shared element transitions al entrar desde un proyecto a su caso de estudio.
6. Layout animations para galerías o cambios de contenido.
7. Microinteracciones con spring animations, press feedback y hover direccional.
8. Animated SVG line drawing solamente si ayuda a representar cómo se conectan las partes de Rienda.

GSAP con ScrollTrigger puede utilizarse solamente para una secuencia compleja, como el storytelling sticky de Rienda. Debe estar aislado en un componente cliente, tener cleanup correcto y no competir con Motion dentro del mismo árbol.

No usar listeners manuales de scroll.

Todas las animaciones deben:

- Mantener 60 fps en dispositivos razonables.
- Animar preferentemente transform y opacity.
- Tener variante para `prefers-reduced-motion`.
- Ser interrumpibles.
- Funcionar correctamente en mobile.
- Desactivarse o simplificarse cuando afecten la lectura.
- Tener una razón: jerarquía, narrativa, feedback o transición.

## Cómo mostrar el uso de IA

Incluir una sección llamada IA como herramienta de trabajo.

Copy inicial:

> No uso inteligencia artificial para reemplazar criterio. La uso para acelerar investigación, diseño, desarrollo, automatización y operación.

Mostrar un proceso real, no una interfaz falsa de chatbot:

- Entender el problema.
- Investigar y ordenar información.
- Diseñar una solución.
- Construir y validar.
- Automatizar y mejorar.

La sección debe demostrar pensamiento y metodología. No debe parecer publicidad genérica sobre IA.

## Stack técnico

- Next.js con App Router.
- React.
- TypeScript estricto.
- Tailwind CSS.
- Motion mediante `motion/react`.
- GSAP y ScrollTrigger solamente si la escena avanzada lo necesita.
- Componentes seleccionados de 21st.dev.
- `next/image` para optimización de recursos.
- Componentes servidor por defecto.
- Islas cliente pequeñas para animaciones.
- Contenido profesional centralizado en archivos tipados.
- Arquitectura sencilla de mantener.

Antes de instalar algo, inspeccionar `package.json`. Utilizar las instrucciones oficiales actuales y no inventar paquetes.

## Calidad

- Responsive real desde mobile hasta monitores grandes.
- Navegación completa con teclado.
- Focus visible.
- Contraste WCAG AA.
- HTML semántico.
- Alt text correcto.
- `prefers-reduced-motion`.
- Sin layout shifts.
- LCP menor a 2.5 segundos como objetivo.
- INP menor a 200 ms como objetivo.
- CLS menor a 0.1.
- Lazy loading para recursos pesados.
- Nada de WebGL o Three.js salvo justificación fuerte.
- SEO completo.
- Metadata por página.
- Open Graph personalizado.
- JSON-LD de tipo Person.
- Sitemap y robots.
- Favicon e identidad visual.
- Página 404 coherente.
- Enlaces externos seguros.

## Veracidad

No inventar:

- Cantidad de clientes.
- Facturación.
- Porcentajes de crecimiento.
- Resultados comerciales.
- Testimonios.
- Empresas con las que trabajé.
- Premios.
- Años de experiencia.
- Proyectos que no fueron proporcionados.

Si falta un dato, centralizarlo como TODO en el archivo de contenido y ocultarlo de producción.

## Entregable

Quiero recibir:

1. Portfolio implementado.
2. Todos los componentes funcionando.
3. Página de CV imprimible.
4. Caso de estudio de Rienda.
5. Animaciones terminadas.
6. Responsive completo.
7. SEO y Open Graph.
8. README con instalación, edición de contenido y despliegue.
9. Lista de recursos que todavía debo aportar.
10. Resultado de typecheck, lint, tests y build.
11. Revisión visual final en desktop y mobile.

El proyecto no está terminado mientras existan secciones con contenido ficticio, animaciones rotas, dependencias innecesarias, errores de consola o componentes genéricos sin adaptar.
