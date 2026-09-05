import type { Project } from "../types";

/** Renders de la maqueta del rediseño, tamaño notebook. */
const MOCK_W = 2188;
const MOCK_H = 1370;

/**
 * Llavero: gestión para inmobiliarias.
 *
 * Todo lo que se afirma acá sale del repositorio del producto (README, docs,
 * bitácora de trabajo e historial de git). No hay cantidad de clientes,
 * facturación ni testimonios porque no hay ninguno verificado para publicar.
 *
 * Sobre las capturas: las de "El parte" y "Cobranzas" son renders de la
 * maqueta del rediseño de agosto de 2026, con datos ficticios armados para la
 * maqueta. La única captura del producto desplegado es la del panel, tomada en
 * modo demostración. El aviso `shotsDisclaimer` lo dice en pantalla.
 */
export const llavero: Project = {
  slug: "llavero",
  status: "published",
  name: "Llavero",
  role: "Fundador, producto y desarrollo",
  kind: "producto propio",
  /* Bronce del isotipo de Llavero: la llave sobre el chip grafito. */
  accent: "#c69049",
  start: "2026-07",
  end: null,
  tagline: "La administración de alquileres de una inmobiliaria, con el CRM y la difusión en el mismo sistema.",
  summary:
    "Software de gestión para inmobiliarias argentinas chicas y medianas. Contratos con ajuste automático por índice, cobranzas con recibo numerado, liquidaciones a propietarios, web de avisos propia y portal por link para inquilinos y propietarios, junto con el CRM y la difusión en portales. En producción con una inmobiliaria real desde julio de 2026.",
  year: "Desde julio de 2026",
  disciplines: ["Producto", "Modelo de datos", "Desarrollo", "Implementación"],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL en Supabase",
    "Prisma",
    "Auth.js",
    "Tailwind CSS",
    "Zod",
    "Bot de WhatsApp con Baileys",
    "Mercado Pago",
    "IA con proveedor intercambiable",
    "Vitest y Playwright",
  ],
  links: [],
  /* La portada es el producto en producción (modo demo), no la maqueta: en la
     home no hay lugar para el aviso que la explica. La maqueta sigue en la galería. */
  cover: {
    src: "/llavero/panel-demo.png",
    alt: "Panel de Llavero en producción con datos de demostración: cuánto se cobró en el mes contra lo facturado, la barra de cobrado, vencido y en fecha, la evolución de la cobranza por mes, lo que hay que liquidar a propietarios, y a la derecha la lista de pendientes de hoy con alquileres vencidos, ajustes, contratos por vencer y liquidaciones sin emitir.",
    width: 1600,
    height: 889,
  },
  shotsDisclaimer:
    "Las capturas de El parte y de Cobranzas son de la maqueta del rediseño de agosto de 2026, con una inmobiliaria, personas e importes inventados para la maqueta. La captura del panel es del producto en modo demostración. Ninguna muestra datos de clientes reales.",

  blocks: [
    {
      id: "problema",
      heading: "El problema",
      paragraphs: [
        "Una inmobiliaria chica en Argentina vive de dos negocios distintos: vender y administrar alquileres. Los CRM del rubro resuelven el primero, con la difusión en portales incluida, y no tocan el segundo. Para los contratos, los ajustes por índice y las liquidaciones a los propietarios, la inmobiliaria paga otro sistema aparte o lo lleva en Excel.",
        "Desde que el contrato de alquiler es libre, cada uno pacta su propio índice y su propia frecuencia de ajuste. Eso vuelve al Excel más frágil todavía: cada mes hay que saber qué contratos ajustan, con qué coeficiente, cuánto se cobró de cada uno, qué honorarios se descuentan y cuánto se le rinde a cada dueño. El error no se nota en la planilla; se nota cuando un propietario reclama.",
      ],
    },
    {
      id: "vision",
      heading: "La visión",
      paragraphs: [
        "Un solo sistema donde la administración de alquileres es el núcleo y no un módulo agregado: el contrato guarda lo pactado, el cronograma de ajustes se calcula desde el índice, la cobranza se genera cada mes con su recibo numerado, y la liquidación al propietario sale de lo cobrado menos honorarios y gastos. Alrededor de eso, lo que la inmobiliaria ya espera de un CRM: cartera, contactos, interesados, reservas, web de avisos propia y publicación en portales.",
        "Después se sumó lo que baja el trabajo del día: un portal por link, sin contraseña, donde el inquilino ve su contrato y sus pagos y el propietario sus liquidaciones; un bot de WhatsApp que responde consultas con el catálogo real y deriva a una persona cuando alguien quiere visitar; un asistente de IA que responde sobre los datos propios; y un asistente de carga guiado, de una pregunta por pantalla, para pasar la cartera al sistema sin formularios largos.",
        "El nombre viene de lo que hace una inmobiliaria: administrar las llaves de propiedades que no son suyas.",
      ],
    },
    {
      id: "rol",
      heading: "Mi participación",
      paragraphs: [
        "Llavero lo llevé yo de punta a punta: la investigación del rubro, las decisiones de producto, el modelo de datos, el desarrollo y la implementación con la primera inmobiliaria. Lo construí sobre la base de Ahorrito, el proyecto anterior de finanzas personales en el que trabajé, podando todo lo que no servía y adaptando lo que sí: autenticación, la capa de IA, el OCR de comprobantes, los reportes y la PWA.",
      ],
      bullets: [
        "Investigación del mercado inmobiliario argentino y definición del alcance por fases: primero el núcleo de alquileres, después captación y difusión, al final los diferenciales con IA.",
        "Modelo de datos inmobiliario y motor de ajustes por índice, con el alquiler vigente derivado del contrato y de los ajustes aplicados.",
        "Desarrollo de la plataforma completa: pantallas, servicios, permisos por rol y aislamiento entre inmobiliarias.",
        "Implementación con la primera inmobiliaria real en julio de 2026: importación de su cartera desde las planillas que exportaba su sistema anterior y una planilla maestra que pide solo lo que el sistema no puede adivinar.",
        "Incorporación de la devolución de un martillero público que revisó el producto: la ficha del cliente como punto de partida, la tasación como línea de facturación, video en la ficha de cada propiedad.",
        "Identidad visual y rediseño del panel, y la exploración de tres direcciones de diseño sobre los mismos datos en agosto de 2026.",
        "Bot de WhatsApp desplegado como servicio en un servidor propio, con cola por chat, reconexión y latido para saber si está vivo.",
        "Planes y modelo de suscripción, con el cobro por transferencia o débito automático de Mercado Pago.",
        "Todo el desarrollo con asistentes de IA como herramienta diaria, verificando en el navegador y contra la base en cada paso.",
      ],
    },
    {
      id: "rediseno",
      heading: "El rediseño de agosto: tres direcciones sobre los mismos datos",
      paragraphs: [
        "Con el producto ya en uso, en agosto de 2026 exploré cómo debería verse una herramienta que se abre todas las mañanas para responder una sola pregunta: quién pagó y quién debe. En vez de una propuesta, dibujé varias direcciones, cada una a partir de un hallazgo de la investigación sobre el oficio inmobiliario, y todas con el mismo juego de datos ficticios: una inmobiliaria de Mendoza con 31 contratos vigentes, un martes 25 de agosto. Así lo único que cambia entre una y otra es el diseño.",
        "La que se ve en estas capturas es El parte. La pantalla principal deja de informar cómo va el negocio y rinde cuentas de ocho controles fijos contra lo pactado: el día de vencimiento, el ajuste que corresponde, el fin del contrato, la autorización de venta, lo que le falta a un aviso para publicarse. Los controles se callan cuando coinciden y hablan de a uno cuando no. El umbral entre ámbar y rojo no lo inventé yo: dos meses consecutivos de atraso es el corte que usa el oficio. Es una maqueta, todavía no está en el producto.",
      ],
    },
    {
      id: "decisiones",
      heading: "Decisiones y aprendizajes",
      paragraphs: [],
      bullets: [
        "Nada que se pueda derivar se guarda mutable. El alquiler vigente sale del contrato más los ajustes aplicados, la mora sale del día de vencimiento y las notificaciones se calculan al abrir la pantalla, sin tareas programadas que puedan quedar desfasadas.",
        "El aislamiento entre inmobiliarias vive en el acceso a datos, no en cada pantalla: todos los métodos del repositorio están acotados a la cuenta, la seguridad por fila se activa sola en cada tabla nueva, y hay tests que prueban que una inmobiliaria no lee ni modifica datos de otra.",
        "Importes exactos donde la cifra se usa para operar. El neto de una liquidación es lo que se transfiere y nadie puede transferir un importe abreviado. Se abrevia solo en los resúmenes.",
        "Las monedas van separadas y no se convierten. Las ventas se piensan en dólares y la administración en pesos; convertir con la cotización del día rompe la comparación entre meses, que es para lo que sirve un reporte.",
        "La primera implementación real enseñó más que cualquier suposición. El importador de planillas se endureció a los golpes: montos en dólares leídos como pesos, ventas cargadas como alquileres, filas descartadas por un valor secundario. La regla que quedó: nada se descarta sin decirlo, y el aviso dice qué campo está mal.",
        "Sugerir, nunca adivinar. La localidad de cada propiedad se deriva de la dirección cargada y se propone con un nivel de confianza, pero una persona la revisa y la guarda. El sistema no escribe una derivación sin ojos humanos.",
        "La interfaz no promete lo que no pasó. Guardar la credencial de un portal dice que los datos se guardaron, no que está conectado, hasta que publique de verdad.",
        "Sin azul, a propósito. El azul corporativo es el default del rubro y hacía que el panel se leyera como plantilla. La estructura es grafito cálido y el único color con nombre es el bronce, el metal de una llave.",
        "La vara para simplificar es que lo entienda un chico de 12 y alguien de 70. Por eso se descartó un modo simple aparte: duplicar cada pantalla las hace divergir a los seis meses. Se simplificó la que ya existía.",
        "Medido, no supuesto. Cada cambio se verifica en el navegador a 390, 768 y 1440 píxeles, en claro y oscuro. Así apareció que en el celular la tabla de cobranzas medía más que la pantalla y el botón de cobrar quedaba afuera.",
      ],
    },
  ],

  areas: [],

  gallery: [
    {
      src: "/llavero/cobranzas.png",
      alt: "Maqueta de la pantalla Cobranzas de Llavero: resumen de agosto con lo que falta cobrar, buscador, filtros Falta cobrar, Vencidas, Cobradas y Todas, y las cobranzas agrupadas en quien debe más de un mes, vencidas del mes y pagos parciales, con un botón para registrar cada cobro.",
      width: MOCK_W,
      height: MOCK_H,
      caption: "La cobranza agrupada por lo que hay que hacer, no por fila: primero quien debe más de un mes.",
    },
    {
      src: "/llavero/parte-movil.png",
      alt: "La maqueta de El parte en un teléfono: el titular con las cosas fuera de lo pactado, la deuda de dos meses de un inquilino con el importe en grande y el botón para escribirle por WhatsApp, y la barra inferior con Parte, Cobranzas, Liquidaciones, Cartera y Más.",
      width: 780,
      height: 1690,
      caption: "El parte en el teléfono, para quien está en la calle.",
    },
    {
      src: "/llavero/panel-demo.png",
      alt: "Panel de Llavero en producción, en modo demostración: lo cobrado del mes sobre lo facturado con una barra de cobrado, vencido y en fecha, la evolución de la cobranza en seis meses, lo que falta liquidar a propietarios y la lista Para hoy con alquileres vencidos, ajustes de alquiler, contratos por vencer, liquidaciones sin emitir y una seña vigente.",
      width: 1600,
      height: 889,
      caption: "El panel que está en producción, con datos de demostración: cuánto se cobró sobre cuánto se facturó.",
    },
    {
      src: "/llavero/landing.png",
      alt: "Página de la presentación Tres direcciones para Llavero, con la maqueta de Cobranzas vista en un teléfono y los selectores para cambiar entre la pantalla principal y Cobranzas, y entre la notebook de la oficina y el teléfono de la calle.",
      width: 2880,
      height: 2000,
      caption: "La presentación de las direcciones de diseño: los mismos datos ficticios en notebook y en teléfono, para que lo único que cambie sea el diseño.",
    },
    {
      src: "/llavero/landing-movil.png",
      alt: "La presentación del rediseño de Llavero abierta en un teléfono: el título Tres direcciones para Llavero, la explicación de que las tres se dibujan con los mismos datos y los botones para elegir cada dirección.",
      width: 390,
      height: 844,
      caption: "La misma presentación, leída desde el celular.",
    },
  ],

  seo: {
    title: "Llavero, gestión para inmobiliarias con los alquileres en el centro",
    description:
      "Caso de estudio de Llavero: contratos con ajuste por índice, cobranzas con recibo, liquidaciones a propietarios, portal por link y bot de WhatsApp para inmobiliarias argentinas. Producto, modelo de datos y desarrollo por Juan Morales.",
  },
};
