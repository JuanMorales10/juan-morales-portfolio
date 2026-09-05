/**
 * Hero y presentación. El texto base viene del brief de Juan; se ajustó el
 * ritmo, no el significado. No hay resultados, métricas ni clientes acá porque
 * no hay ninguno verificado para mostrar.
 */

export const hero = {
  /** Se anima línea por línea, por eso viene partido. */
  titleLines: [
    "Convierto ideas",
    "y operaciones complejas",
    "en productos digitales",
    "que funcionan.",
  ],
  /** Versión plana para `<title>`, metadatos y lectores de pantalla. */
  titlePlain:
    "Convierto ideas y operaciones complejas en productos digitales que funcionan.",
  description:
    "Cofundador de Rienda. Producto, desarrollo e inteligencia artificial aplicados a problemas reales de negocio.",
  location: "Mendoza, Argentina",
  /** Estado factual, no una promesa de disponibilidad que nadie confirmó. */
  status: "Cofundador y CEO de Rienda",
  primaryCta: { label: "Ver proyectos", href: "#proyectos" },
  secondaryCta: { label: "Conocer mi recorrido", href: "#recorrido" },
  portrait: {
    src: "/perfil/juan-morales.jpg",
    alt: "Retrato de Juan Morales.",
    width: 400,
    height: 400,
  },
} as const;

export const intro = {
  eyebrow: "Quién soy",
  lead: "Soy Juan Morales, cofundador y CEO de Rienda, una plataforma integral para comercios argentinos.",
  paragraphs: [
    "Rienda conecta ventas, caja, stock, facturación electrónica con ARCA, clientes, proveedores, equipos, sucursales, canales online, WhatsApp, reportes e inteligencia artificial aplicada.",
    "Su diferencial es que toda la operación trabaja conectada. Una venta puede actualizar caja y stock, generar una factura, alimentar reportes y sincronizar los distintos canales del comercio.",
    "En Rienda participo en estrategia de producto, experiencia de usuario, arquitectura, desarrollo, integraciones, seguridad y operación del producto SaaS.",
  ],
  /** Notas al margen en monoespaciada. Datos, no adjetivos. */
  asides: [
    { label: "Base", value: "Mendoza, Argentina" },
    { label: "En Rienda desde", value: "Febrero de 2026" },
    { label: "También", value: "Tecnología y Marketing en Poltrona de Interiores" },
  ],
} as const;
