import type { Project } from "../types";

const LANDING_W = 1920;
const LANDING_H = 1194;
const APP_W = 1440;
const APP_H = 804;

/**
 * Ahorrito: finanzas personales para Argentina, desde mayo de 2026.
 *
 * Todo lo que se afirma acá sale del repositorio original (README, docs/ y el
 * historial de git) y de los repos que nacieron de él. No hay usuarios,
 * ingresos ni resultados porque no hay ninguno verificado para publicar.
 */
export const ahorrito: Project = {
  slug: "ahorrito",
  status: "published",
  name: "Ahorrito",
  role: "Producto y desarrollo principal",
  kind: "producto propio",
  /* Lima de la marca: el --primary del producto, oklch(0.87 0.19 128), medido también en las capturas. */
  accent: "#b0eb52",
  start: "2026-05",
  end: null,
  tagline: "Las finanzas personales de un argentino en un solo lugar, y un cerebro digital que las conecta.",
  summary:
    "Un portal de finanzas personales para Argentina: ingresos, gastos, tarjetas, deudas, patrimonio, presupuestos y metas en un solo lugar, con importación de resúmenes clasificada por IA, un asistente que explica en simple y un Cerebro Digital que dibuja la plata de la persona como una red viva. De esta base salieron después Rienda y Llavero.",
  year: "Desde mayo de 2026",
  disciplines: ["Producto", "Arquitectura", "Desarrollo", "Visualización de datos"],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Auth.js",
    "d3-force",
    "IA con DeepSeek y Anthropic",
    "Mercado Pago",
  ],
  links: [
    {
      label: "Visitar tuahorrito.com",
      href: "https://tuahorrito.com",
      printAs: "tuahorrito.com",
    },
  ],
  cover: {
    src: "/ahorrito/landing-hero.png",
    alt: "Portada de la landing de Ahorrito: el titular Todo tu dinero, en un solo lugar, en lima sobre fondo oscuro, y una tarjeta de resumen con cuánto se puede gastar en el mes, patrimonio, ingresos y ahorro.",
    width: LANDING_W,
    height: LANDING_H,
  },
  shotsDisclaimer:
    "Capturas del producto tomadas en el entorno de desarrollo con la cuenta de demostración. Los importes, cuentas y deudas que se ven son datos de ejemplo, no de una persona real.",

  blocks: [
    {
      id: "problema",
      heading: "El problema",
      paragraphs: [
        "Una persona en Argentina tiene la plata repartida entre bancos, tarjetas y billeteras, y cada uno le muestra su pedazo. Consolidar todo es tedioso y, aun consolidado, es difícil de interpretar: no hay una foto única de cómo estoy ni de hacia dónde voy.",
        "Encima el contexto local suma variables propias: varias cotizaciones del dólar, una inflación que cambia lo que valen los números de hace seis meses y el monotributo con sus categorías y vencimientos. Ahorrito nació para tratar todo eso como parte del mismo problema.",
      ],
    },
    {
      id: "vision",
      heading: "La visión",
      paragraphs: [
        "Un solo lugar donde una persona común, sin ser experta en finanzas, carga o importa sus movimientos, los ve clasificados y entiende su situación: ingresos, gastos, tarjetas, deudas, patrimonio, presupuestos y metas, con proyecciones hacia adelante. La IA entra como clasificadora de los resúmenes importados y como copiloto que explica en simple, con una regla fija: no inventa cifras y no da asesoramiento financiero regulado.",
        "La pieza distintiva es el Cerebro Digital: la vida financiera de la persona dibujada como una red viva. Cada neurona es un área (gastos, deudas, tarjetas, dólar, inflación, monotributo, metas) y las conexiones muestran cómo una cosa afecta a la otra. El tablero sigue siendo la vista operativa; el Cerebro es la vista estratégica, para explorar y entender.",
      ],
    },
    {
      id: "rol",
      heading: "Mi participación",
      paragraphs: [
        "Ahorrito arrancó en mayo de 2026 y fue un proyecto de dos personas. Arranqué el repositorio, escribí las especificaciones y llevé la mayor parte del desarrollo; la otra persona del equipo se ocupó de la educación financiera gamificada, el modo hogar, el perfil fiscal y parte de la investigación de mercado.",
      ],
      bullets: [
        "Especificación del producto, arquitectura por capas y modelo de datos con Prisma sobre PostgreSQL, con todo acceso a datos filtrado por usuario.",
        "Autenticación con Auth.js: email y contraseña, login con Google, recuperación de contraseña y verificación en dos pasos.",
        "Importador de resúmenes en CSV, Excel y PDF con detección de duplicados y clasificación automática por IA con nivel de confianza visible.",
        "Asistente financiero con chat sobre los datos del usuario, alertas por reglas, proyecciones con escenarios y reportes exportables.",
        "Cerebro Digital: motor determinístico del grafo, visualización con d3-force y la capa de IA que interpreta cada neurona.",
        "Carga sin teclado: foto del ticket con OCR en el navegador y dictado por voz.",
        "Cotizaciones del dólar y cripto en vivo, inflación por API y valores históricos expresados en pesos de hoy.",
        "Identidad visual, landing pública, calculadoras públicas para SEO, suscripción Pro con Mercado Pago y despliegue en Vercel.",
      ],
    },
    {
      id: "decisiones",
      heading: "Decisiones y aprendizajes",
      paragraphs: [],
      bullets: [
        "Aislar los datos de cada usuario en el repositorio, no en quien lo llama. Si el filtro por usuario vive en la capa de acceso a datos, olvidarse es imposible. Es la misma decisión que después tomé en Rienda.",
        "La IA es un adaptador, no una dependencia. Una sola interfaz con proveedores intercambiables (DeepSeek, Anthropic y un mock para desarrollo): sin clave el producto sigue funcionando, y al proveedor viaja un resumen agregado del usuario, no la lista cruda de movimientos.",
        "Un saldo se deriva, no se guarda. Saldo inicial más movimientos confirmados, calculado en una sola función que usan el tablero, el patrimonio, las cuentas, el asistente y el Cerebro. Cuando aparecieron dos funciones que decían cosas distintas, la solución fue borrar una.",
        "Menos carga manual. El usuario no quiere tipear: foto del ticket con el OCR corriendo en el navegador (la imagen no sale del dispositivo), dictado por voz con la API del propio navegador e importación con detección de duplicados.",
        "El Cerebro se construyó en dos capas: un motor determinístico del grafo (nodos, conexiones, severidad) con sus propios tests, y encima la visualización y la IA. La IA interpreta lo que hay; no decide qué existe en el grafo.",
        "Lo que el historial muestra: el 10 de julio de 2026 esta base se copió dos veces. De una copia salió Ahorrito Negocios, que el 30 de julio pasó a llamarse Rienda; de la otra salió Propia, que el 28 de julio pasó a ser Llavero. Las dos se llevaron la autenticación con doble factor, la capa de IA multiproveedor, el OCR de comprobantes, los reportes y los tests. El asistente por WhatsApp que creció en Ahorrito Negocios sobre esa misma capa de IA se portó a Llavero entre el 14 y el 17 de julio. Construir la base como si fuera a reusarse pagó: dos productos nuevos arrancaron con lo caro ya hecho y probado.",
      ],
    },
  ],

  /* La página del caso muestra la galería; el recorrido por áreas es de Rienda. */
  areas: [],

  gallery: [
    {
      src: "/ahorrito/dashboard.png",
      alt: "Tablero de Ahorrito: cotizaciones del dólar, el euro y cripto en vivo, cuánto se puede gastar tranquilo este mes, patrimonio neto, ingresos, egresos y tasa de ahorro, con el menú lateral de secciones.",
      width: APP_W,
      height: APP_H,
      caption: "El tablero: la vista operativa, con las cotizaciones arriba y la cifra que importa primero.",
    },
    {
      src: "/ahorrito/cerebro-galaxia.png",
      alt: "Cerebro Digital de Ahorrito: red de neuronas sobre un fondo de estrellas, cada una un área de las finanzas (gastos, deudas, tarjetas, dólar, inflación, monotributo, metas) unidas por conexiones, y un panel con el resumen del cerebro financiero.",
      width: APP_W,
      height: APP_H,
      caption:
        "El Cerebro Digital: cada neurona es un área de la plata y las conexiones muestran cómo se afectan entre sí. Se arrastra, se navega y se enfoca.",
    },
    {
      src: "/ahorrito/cerebro-foco.png",
      alt: "Cerebro Digital de Ahorrito con la neurona Deudas enfocada: se iluminan sus conexiones con Vencimientos, Tarjetas y Patrimonio, y el panel lateral muestra dos deudas activas, las conexiones explicadas y el botón Ver plan de pago.",
      width: APP_W,
      height: APP_H,
      caption:
        "Al enfocar una neurona el resto se atenúa, se iluminan sus conexiones y el panel explica qué mirar y qué hacer.",
    },
  ],

  seo: {
    title: "Ahorrito, finanzas personales con un cerebro digital",
    description:
      "Caso de estudio de Ahorrito: portal de finanzas personales para Argentina con importación de resúmenes, clasificación por IA, asistente financiero y un Cerebro Digital interactivo. Producto, arquitectura y desarrollo por Juan Morales.",
  },
};
