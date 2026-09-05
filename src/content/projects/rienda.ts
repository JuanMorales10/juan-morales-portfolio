import type { Project } from "../types";

const SHOT_W = 2880;
const SHOT_H = 1800;

/**
 * Caso de estudio principal.
 *
 * Todo lo que se afirma acá lo declaró Juan o se ve en las capturas que él
 * mismo preparó. No hay cantidad de clientes, facturación, crecimiento ni
 * testimonios porque no hay ninguno verificado para publicar.
 */
export const rienda: Project = {
  slug: "rienda",
  status: "published",
  name: "Rienda",
  role: "Cofundador y CEO",
  kind: "producto propio",
  /* Petróleo de la marca de Rienda. */
  accent: "#00615F",
  start: "2026-02",
  end: null,
  tagline: "La operación completa de un comercio, trabajando conectada.",
  summary:
    "Una plataforma para comercios argentinos donde vender, cobrar, facturar, controlar el stock y cerrar la caja son partes del mismo movimiento y no cinco sistemas que hay que reconciliar a mano.",
  year: "Desde 2026",
  disciplines: ["Producto", "Arquitectura", "Desarrollo", "Operación"],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Prisma",
    "Facturación electrónica con ARCA",
    "WhatsApp",
  ],
  links: [{ label: "Visitar rienda.ar", href: "https://rienda.ar", printAs: "rienda.ar" }],
  cover: {
    src: "/rienda/producto/vender-hero.png",
    alt: "Pantalla de venta de Rienda con el detalle del ticket, los productos con más rotación y el total a cobrar.",
    width: SHOT_W,
    height: SHOT_H,
  },
  shotsDisclaimer:
    "Capturas del producto real con datos de demostración. Los comercios, nombres e importes que se ven son de ejemplo.",

  blocks: [
    {
      id: "problema",
      heading: "El problema",
      paragraphs: [
        "Un comercio chico o mediano en Argentina termina operando con las piezas separadas: un sistema para vender, una planilla para el stock, otro lugar para facturar, el banco y Mercado Pago por su cuenta, y la tienda online viviendo aparte.",
        "El costo no es la licencia de cada herramienta. Es que el mismo dato se carga varias veces, cada versión dice algo distinto y nadie sabe con certeza cuánto se vendió, cuánto queda y cuánto entró de verdad. La reconciliación se hace de noche, a mano, y con la caja ya cerrada.",
      ],
    },
    {
      id: "vision",
      heading: "La visión",
      paragraphs: [
        "Que el comercio cargue el dato una sola vez y el sistema se haga cargo del resto. Una venta en el mostrador actualiza la caja y el stock, puede generar la factura electrónica, alimenta los reportes del período y sincroniza el catálogo de los canales online.",
        "Eso obliga a diseñar el producto como una sola operación con vistas distintas, no como módulos que después se integran. Es una decisión de arquitectura y de producto al mismo tiempo, y condiciona todo lo demás.",
      ],
    },
    {
      id: "rol",
      heading: "Mi participación",
      paragraphs: [
        "Trabajo en Rienda desde febrero de 2026 como cofundador y CEO, con las manos dentro del producto todos los días.",
      ],
      bullets: [
        "Estrategia de producto: qué se construye, en qué orden y qué se descarta.",
        "Experiencia de usuario de la operación diaria, desde el mostrador hasta el cierre.",
        "Arquitectura de la aplicación y modelo de datos.",
        "Desarrollo de la plataforma.",
        "Integraciones: facturación electrónica con ARCA, canales de venta online y WhatsApp.",
        "Seguridad y aislamiento de los datos de cada comercio.",
        "Operación del SaaS en producción.",
      ],
    },
    {
      id: "decisiones",
      heading: "Decisiones y aprendizajes",
      paragraphs: [],
      bullets: [
        "El mostrador manda. Si una función necesita más de dos decisiones con un cliente esperando, está mal diseñada. Los atajos de teclado y el cobro en un solo gesto no son un extra: son el requisito.",
        "Preferir avisar antes que bloquear. El sistema deja vender sin stock y lo dice; deja cargar un producto sin costo y avisa que el margen no es real. Un sistema que frena la venta se deja de usar.",
        "El lenguaje del producto es el del comercio, no el de la contabilidad. Dónde está la plata, lo que pasó en el turno, tiene que haber en el cajón.",
        "Nada de números sin trazabilidad. Cada saldo se explica por movimientos que se pueden abrir y auditar, porque el día que no cierra es cuando el sistema se gana o se pierde la confianza.",
        "Aislar los datos de cada comercio desde el primer día es más barato que hacerlo después. Es una decisión de arquitectura, no una función.",
      ],
    },
  ],

  areas: [
    {
      id: "vender",
      label: "Vender",
      title: "El mostrador, en una sola pantalla",
      body: "Escaneo o búsqueda por nombre, descuento, cliente, y el cobro en un gesto. La pantalla avisa si algo se está vendiendo sin stock en lugar de bloquear la venta, porque el cliente está esperando.",
      shot: {
        src: "/rienda/producto/vender-hero.png",
        alt: "Pantalla Vender de Rienda: detalle del ticket con tres productos, aviso de venta sin stock, total a cobrar y listado de productos con más rotación.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "turno",
      label: "Turno y arqueo",
      title: "Lo que pasó en el turno, movimiento por movimiento",
      body: "Ventas, pagos a proveedores, cobros de cuenta corriente, ingresos y retiros, en orden y con hora. Al costado, lo que tiene que haber en el cajón para contar y cerrar sin discutir.",
      shot: {
        src: "/rienda/producto/caja-arqueo.png",
        alt: "Pantalla Turno y arqueo de Rienda: lista de movimientos del turno y panel de efectivo en el cajón con apertura, ventas, ingresos y retiros.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "productos",
      label: "Productos",
      title: "Precio, IVA, margen y stock en la misma fila",
      body: "El catálogo se lee como una tabla de decisión, no como un inventario. Cuando un costo quedó desactualizado el sistema lo dice y aclara que el margen puede no ser real.",
      shot: {
        src: "/rienda/producto/productos-rd.png",
        alt: "Pantalla Productos de Rienda: catálogo con precio, margen y stock por producto, filtros por sucursal y avisos de costos desactualizados y stock bajo.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "dinero",
      label: "Dinero",
      title: "Dónde está la plata del negocio",
      body: "Caja del local, bancos y billeteras en una sola vista, cada saldo explicado por su saldo inicial más los movimientos. Pasar plata de un lado a otro es una operación del producto, no una anotación.",
      shot: {
        src: "/rienda/producto/cuentas.png",
        alt: "Pantalla Cuentas de Rienda: caja del local, bancos y billeteras con sus saldos y el detalle de saldo inicial más movimientos.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "reportes",
      label: "Reportes",
      title: "El cierre del período, comparado contra el anterior",
      body: "Ventas, egresos, resultado y rentabilidad del período, con la comparación contra el tramo anterior y el aviso de qué renglones todavía no tienen costo cargado. Un número sin su advertencia miente.",
      shot: {
        src: "/rienda/producto/reportes-cierre.png",
        alt: "Pantalla Reportes de Rienda: ventas por día, comparación con el período anterior, rentabilidad, medios de pago y productos más vendidos.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "tienda",
      label: "Tienda y WhatsApp",
      title: "El mismo catálogo, publicado",
      body: "La tienda online del comercio se arma con los productos que ya están cargados, con su stock y sus precios. No hay un segundo catálogo que mantener al día.",
      shot: {
        src: "/rienda/producto/tienda-rd.png",
        alt: "Tienda online de un comercio hecha con Rienda: portada con el nombre del negocio, buscador, filtros por categoría y grilla de productos con precios.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
  ],

  gallery: [
    {
      src: "/rienda/producto/vender-movil.png",
      alt: "Pantalla de venta de Rienda en un teléfono, con el detalle del ticket y el botón de cobro al alcance del pulgar.",
      width: 780,
      height: 1560,
      caption: "La venta en el teléfono: la misma operación, resuelta con una mano.",
    },
    {
      src: "/rienda/marca/brand-board.png",
      alt: "Tablero de marca de Rienda con el logotipo, la paleta de petróleo, tinta, latón y papel, y la tipografía del producto.",
      width: 1600,
      height: 1000,
      caption: "La marca se definió junto con el producto, no después.",
    },
    {
      src: "/rienda/publicacion/lanzamiento-linkedin.jpg",
      alt: "Imagen usada en la publicación de presentación de Rienda.",
      width: 480,
      height: 252,
      caption: "La pieza con la que se presentó Rienda públicamente.",
    },
  ],

  seo: {
    title: "Rienda, la operación de un comercio trabajando conectada",
    description:
      "Caso de estudio de Rienda: ventas, caja, stock, facturación electrónica y canales online en una sola operación. Producto, arquitectura y desarrollo por Juan Morales.",
  },
};
