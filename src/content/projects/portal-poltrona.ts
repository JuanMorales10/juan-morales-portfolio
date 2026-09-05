import type { Project } from "../types";

const SHOT_W = 2880;
const SHOT_H = 1800;

/**
 * Portal Poltrona: herramienta interna de la empresa donde Juan es responsable
 * de Tecnología y Marketing.
 *
 * Todo lo que se afirma acá sale del README, el manual, el roadmap y el
 * historial de git del repositorio del portal. No hay cantidad de presupuestos,
 * ventas ni resultados porque no hay ninguno verificado para publicar. El
 * portal es interno y no se indexa: no se enlaza desde acá.
 */
export const portalPoltrona: Project = {
  slug: "portal-poltrona",
  status: "published",
  name: "Portal Poltrona",
  role: "Responsable de Tecnología y Marketing",
  kind: "herramienta interna",
  client: "Poltrona de Interiores",
  /* Greige de la paleta del portal: marca el ítem activo del menú y la línea de lo presupuestado en el tablero. */
  accent: "#b7aa8f",
  start: "2026-07",
  end: null,
  tagline: "Presupuestos, seguimiento y cobros de una tienda de muebles, cifrados en el navegador.",
  summary:
    "El portal interno de Poltrona, tienda de mobiliario y diseño de interiores de Mendoza. Se arma el presupuesto con las fotos del catálogo, sale en PDF listo para WhatsApp, se sigue hasta la seña y el pedido, y los datos del negocio viven cifrados en el navegador: sin framework y sin ningún servidor que vea un dato en claro.",
  year: "2026",
  disciplines: ["Producto", "Desarrollo", "Seguridad", "Diseño de interfaz"],
  stack: [
    "HTML, CSS y JavaScript sin framework",
    "WebCrypto: AES-256-GCM y PBKDF2",
    "jsPDF",
    "Chart.js",
    "Netlify Functions y Netlify Blobs",
    "Python para el scraper del catálogo",
  ],
  links: [
    { label: "Sitio de Poltrona", href: "https://poltrona.com.ar", printAs: "poltrona.com.ar" },
  ],
  cover: {
    src: "/portal-poltrona/armador.png",
    alt: "Armador de presupuestos del Portal Poltrona: datos del presupuesto, estilo del PDF, validez y el catálogo de productos con fotos y filtros por categoría.",
    width: SHOT_W,
    height: SHOT_H,
  },
  shotsDisclaimer:
    "Capturas del portal real con datos de demostración cargados para esta ficha: los clientes, presupuestos, recibos y tareas que se ven son de ejemplo. Los productos, fotos y precios son los públicos del catálogo de poltrona.com.ar.",

  blocks: [
    {
      id: "problema",
      heading: "El problema",
      paragraphs: [
        "Poltrona vende muebles y diseño de interiores en Mendoza. Un presupuesto de living o de comedor junta varios productos, cada uno con medidas, tela y color, y un precio que a veces no está publicado y hay que calcular. Después hay que mandarlo, seguirlo, cobrar la seña, pedirle al taller y entregar.",
        "Cada parte de ese trabajo vivía en un lugar distinto: el catálogo con las fotos en la web, la fórmula del precio de venta en una planilla de las vendedoras, la conversación con el cliente en WhatsApp. Y todo lo que se conversa con un cliente es información sensible del negocio: quién pidió qué, a qué precio, cuánto señó.",
      ],
    },
    {
      id: "solucion",
      heading: "La solución",
      paragraphs: [
        "Un portal interno con todo el trabajo comercial en un solo lugar: el armador de presupuestos con las fotos de los 218 productos de la web, el historial con estados, los pedidos, el recibero, la agenda de clientes, las tareas del día, el tablero del período y las plantillas de WhatsApp. El PDF se genera en el navegador en tres estilos y se manda con el chat del cliente ya abierto.",
        "Técnicamente es un sitio estático: HTML, CSS y JavaScript sin framework, servido desde Netlify. Lo distinto está en cómo cuida los datos. Clientes, presupuestos, pedidos y tareas se cifran en el dispositivo con una clave AES-256-GCM que se guarda envuelta por usuario con PBKDF2 de 310.000 iteraciones. La sincronización entre la computadora del local y los celulares viaja por Netlify Functions y se guarda en Netlify Blobs ya cifrada: el servidor solo ve texto ilegible. Sin cookies, sin analytics, sin CDNs de terceros; fuentes, librerías y fotos salen del mismo origen, con CSP estricta.",
        "Los usuarios tienen roles: administrador, administración, vendedora y marketing. El primer usuario del dispositivo es el administrador y crea al resto; los demás dispositivos entran con un código de equipo que funciona como llave.",
      ],
    },
    {
      id: "rol",
      heading: "Mi participación",
      paragraphs: [
        "Soy responsable de Tecnología y Marketing de Poltrona desde mayo de 2026. El portal lo diseñé y lo desarrollé de punta a punta, de la primera pantalla al manual, entre julio y agosto de 2026, y sigue en uso.",
      ],
      bullets: [
        "Definición del alcance por etapas: de la base comercial al seguimiento, los pedidos y cobros, la venta sugerida, la sincronización y el recibero.",
        "Diseño de la interfaz: sistema propio con Cormorant Garamond y Archivo, paleta de tinta, crema y musgo, números tabulares y estados de foco y de presionado.",
        "Modelo de seguridad: cifrado en el navegador, clave de datos envuelta por usuario, roles, código de equipo y cabeceras estrictas.",
        "Backend mínimo en Netlify Functions y Blobs para sincronizar el estado cifrado entre dispositivos, con fusión de cambios.",
        "Generación de PDF en el navegador: presupuestos en tres estilos, recibos y órdenes de trabajo para los talleres.",
        "Scraper en Python que baja productos, categorías y fotos de poltrona.com.ar y regenera el catálogo.",
        "Conector con Tienda Nube para publicar precios en la web, listo a falta de las credenciales de la tienda.",
        "Manual de uso escrito en criollo para el equipo.",
      ],
    },
    {
      id: "decisiones",
      heading: "Decisiones y aprendizajes",
      paragraphs: [],
      bullets: [
        "Cifrar en el navegador cambia el contrato con quien usa la herramienta: sin la contraseña no hay recuperación posible. El portal lo dice en la puerta y lo repite el manual. Es el precio de que el servidor nunca vea un dato en claro, y lo elegí con los ojos abiertos.",
        "Al ser un sitio estático, el código y el catálogo son públicos para quien tenga el link. Lo que protege la contraseña son los datos: clientes, presupuestos, precios negociados. Preferí escribirlo en el README antes que dejar que alguien crea otra cosa.",
        "El primer administrador solo se puede crear con un parámetro explícito en la dirección. Quien abra el link sin ser del equipo no puede inventarse un usuario y ver todo: solo puede entrar con el código de equipo.",
        "La sincronización primero pisaba con la versión más nueva y avisaba. Cuando dos personas trabajan a la vez eso pierde trabajo, así que pasó a fusionar.",
        "La calculadora de precio replica exactamente la planilla de las vendedoras, con costo, flete, margen por tipo e IVA, en lugar de proponer una fórmula nueva. Una herramienta interna se adopta si habla como el equipo.",
        "Los costos de los talleres se ven según el rol: quien vende no ve lo que se le paga al proveedor. El rol administración los ve, pero no toca usuarios ni borra nada.",
        "El recibo es un comprobante de pago y no una factura, y la pantalla lo aclara: la factura la emite el sistema administrativo. Un documento que parece otro trae problemas que ningún diseño arregla.",
        "Cifrar fotos embebidas hizo desbordar la pila al codificar en base64 de un solo tirón. Se pasó a codificar por bloques. Un detalle chico que tiraba abajo el guardado entero.",
        "Las skills de diseño para el asistente de IA se instalaron solo si eran markdown puro. La que traía scripts de Python y 1,8 MB de CSV quedó afuera hasta auditarla línea por línea.",
      ],
    },
  ],

  areas: [
    {
      id: "armador",
      label: "Armador",
      title: "El presupuesto se arma tocando las fotos",
      body: "Se busca en el catálogo por nombre, SKU o categoría y cada producto suma una línea con espacio, cantidad, detalle y precio. El presupuesto queda agrupado por sector, se reordena arrastrando y propone qué falta para completar el ambiente. Sale en PDF en tres estilos.",
      shot: {
        src: "/portal-poltrona/armador-detalle.png",
        alt: "Detalle del presupuesto en el armador: líneas agrupadas en Living y Comedor con foto, cantidad, precio unitario e importe, y debajo la fila de sugerencias para completar el ambiente.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "historial",
      label: "Historial",
      title: "Cada presupuesto con su estado y su próximo paso",
      body: "Borrador, Enviado, Aprobado o Perdido, con el próximo paso a la vista. Al aprobar se crea solo el pedido y la tarea de reclamar la seña; al perder, pide el motivo. Varios presupuestos del mismo cliente se pueden unir en uno.",
      shot: {
        src: "/portal-poltrona/historial.png",
        alt: "Historial de presupuestos del Portal Poltrona: cuatro fichas con estado Perdido, Borrador, Aprobado y Enviado, el próximo paso sugerido, el total y los botones de abrir, duplicar, PDF y WhatsApp.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "pedidos",
      label: "Pedidos",
      title: "Lo que pasa después de la venta",
      body: "Nueve pasos desde la seña pendiente hasta finalizado, con seña, saldo y forma de pago, y el total pendiente de cobro arriba. Al cambiar de estado se crean las tareas que siguen, y desde el pedido se abre el recibo ya cargado.",
      shot: {
        src: "/portal-poltrona/pedidos.png",
        alt: "Pantalla Pedidos del Portal Poltrona: tarjetas de pendiente de cobro, pedidos activos y finalizados, y un pedido en el paso uno de nueve con campos de seña, saldo y forma de pago.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "recibero",
      label: "Recibero",
      title: "El comprobante que se le da al cliente cuando paga",
      body: "Detalle línea por línea, descuento, monto recibido y saldo pendiente a la vista antes de imprimir. La numeración es correlativa y no se repite aunque se borre un recibo. Es un comprobante de pago, no una factura, y el portal lo aclara.",
      shot: {
        src: "/portal-poltrona/recibos.png",
        alt: "Recibero del Portal Poltrona: datos del recibo, tabla de lo cobrado con cantidad, unidad, precio e importe, monto recibido en grande y el saldo pendiente.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "clientes",
      label: "Clientes",
      title: "La agenda, atada a todo lo demás",
      body: "Debajo de cada cliente se ven sus presupuestos, pedidos y recibos, y un botón arranca un presupuesto con sus datos ya cargados. De dónde vino cada cliente alimenta el reporte de conversión por canal.",
      shot: {
        src: "/portal-poltrona/clientes.png",
        alt: "Pantalla Clientes del Portal Poltrona: formulario de nuevo cliente y fichas de clientes con su presupuesto, su estado y sus recibos con saldo.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "dashboard",
      label: "Dashboard",
      title: "El período, en números que el equipo entiende",
      body: "Presupuestado, aprobado, en juego, tasa de aprobación, ticket promedio, perdido y pendiente de cobro, con la evolución del negocio y los cortes por vendedora, canal y motivo de pérdida. Es lo único que ve el rol de marketing.",
      shot: {
        src: "/portal-poltrona/resumen.png",
        alt: "Dashboard del Portal Poltrona: tarjetas con presupuestos del período, aprobado, en juego, tasa de aprobación, ticket promedio, perdido y pendiente de cobro, y el gráfico de evolución del negocio.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
  ],

  gallery: [
    {
      src: "/portal-poltrona/puerta.png",
      alt: "Puerta de acceso del Portal Poltrona: logotipo, selector de usuario, contraseña y el aviso de que los datos están cifrados en el dispositivo.",
      width: SHOT_W,
      height: SHOT_H,
      caption: "La puerta: usuario, contraseña y ningún dato legible sin ella.",
    },
    {
      src: "/portal-poltrona/recibos-talonario.png",
      alt: "Talonario del recibero: total cobrado del mes, buscador y dos recibos numerados con su concepto, importe y saldo pendiente.",
      width: SHOT_W,
      height: SHOT_H,
      caption: "El talonario: numeración correlativa, total cobrado del mes y el saldo que queda de cada recibo.",
    },
    {
      src: "/portal-poltrona/resumen-graficos.png",
      alt: "Gráficos del dashboard: evolución del negocio en los últimos treinta días, aprobado por canal y ventas por vendedora.",
      width: SHOT_W,
      height: SHOT_H,
      caption: "Evolución del negocio, aprobado por canal y ventas por vendedora, con Chart.js servido desde el mismo origen.",
    },
    {
      src: "/portal-poltrona/tareas.png",
      alt: "Pantalla Tareas del Portal Poltrona: formulario de nueva tarea y lista de pendientes creadas automáticamente, como reclamar la seña y los seguimientos a uno y tres días.",
      width: SHOT_W,
      height: SHOT_H,
      caption: "Las tareas se crean solas al enviar o aprobar: seguimientos a uno, tres y siete días, y reclamar la seña.",
    },
  ],

  seo: {
    title: "Portal Poltrona, gestión comercial cifrada en el navegador",
    description:
      "Caso de estudio del portal interno de Poltrona: armador de presupuestos con PDF, seguimiento, pedidos y recibero, con los datos cifrados con AES-256-GCM en el navegador. Diseño y desarrollo por Juan Morales.",
  },
};
