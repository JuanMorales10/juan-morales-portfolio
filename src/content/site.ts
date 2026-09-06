import type { ExternalLink, Pending } from "./types";

/**
 * Configuración del sitio y datos de contacto.
 *
 * Los valores entre corchetes (`[ASI]`) son datos que Juan todavía no entregó.
 * `isPlaceholder` los detecta y el sitio los oculta en producción, así que se
 * pueden dejar acá sin riesgo de publicar un dato falso o un enlace roto.
 * En desarrollo sí se ven, marcados, para que no se olviden.
 */

/** `true` cuando el valor es un marcador pendiente y no un dato real. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && /^\[[A-Z0-9_]+\]$/.test(value.trim());
}

/** Devuelve el valor solo si es un dato real; si está pendiente, `null`. */
export function realValue(value: Pending | null | undefined): string | null {
  if (!value || isPlaceholder(value)) return null;
  return value;
}

/** En desarrollo mostramos los pendientes marcados; en producción, no. */
export const showPending = process.env.NODE_ENV !== "production";

/**
 * URL absoluta del sitio, para canonical, Open Graph, sitemap y JSON-LD.
 *
 * Manda `NEXT_PUBLIC_SITE_URL`: es la que hay que cargar cuando el dominio
 * propio esté listo. Si no está, se usa el dominio de producción que Vercel
 * expone solo (sin protocolo) en cada build, así el sitio publicado nunca
 * emite direcciones que no resuelven. En local, sin ninguna de las dos, queda
 * un valor de reserva y `urlIsProvisional` avisa a quien lo necesite.
 */
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (vercelUrl ? `https://${vercelUrl}` : undefined);

export const site = {
  url: configuredUrl || "https://juanmorales.dev",
  urlIsProvisional: !configuredUrl,

  name: "Juan Morales",
  shortName: "Juan Morales",
  role: "Cofundador y CEO de Rienda",
  location: "Mendoza, Argentina",
  locale: "es-AR",
  languageTag: "es-AR",

  description:
    "Cofundador de Rienda. Producto, desarrollo e inteligencia artificial aplicados a problemas reales de negocio.",

  email: "juanmoralesp19@gmail.com" as Pending,

  /**
   * Teléfono de contacto. Recursos humanos lo busca y su ausencia se nota, pero
   * publicarlo en una página abierta y en un PDF descargable lo deja al alcance
   * de cualquier robot que junte números. Queda como marcador hasta que Juan
   * decida: mientras tanto no se publica, igual que el resto de los pendientes.
   */
  phone: "[TELEFONO]" as Pending,

  /** Cuenta real: la referencia el propio README de Llavero. */
  github: "https://github.com/JuanMorales10" as Pending,

  linkedin: "https://www.linkedin.com/in/juan-morales1/",
  rienda: "https://rienda.ar",
} as const;

/** Enlaces de contacto ya filtrados: los pendientes no llegan a la vista. */
export const contactLinks: ExternalLink[] = [
  { label: "LinkedIn", href: site.linkedin, printAs: "linkedin.com/in/juan-morales1" },
  { label: "Rienda", href: site.rienda, printAs: "rienda.ar" },
];

export const navigation = [
  { label: "Rienda", href: "/#rienda" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Cómo trabajo", href: "/#como-trabajo" },
  { label: "Recorrido", href: "/#recorrido" },
  { label: "Contacto", href: "/#contacto" },
] as const;

/**
 * Lo que falta para dar el sitio por cerrado. Se muestra en el README y, en
 * desarrollo, en la consola del servidor. No se publica.
 */
export const pendingAssets = [
  "Dominio definitivo (variable de entorno `NEXT_PUBLIC_SITE_URL`).",
  "Nombre real de la empresa de Barcelona (enero a noviembre de 2024): hasta que esté, ese puesto no se publica.",
  "Decidir si el teléfono va en el CV público: recursos humanos lo busca, pero queda expuesto en una página abierta.",
  "Entre noviembre de 2024 y febrero de 2026 Juan estuvo parado en tecnología. El CV muestra el hueco sin explicarlo.",
  "Confirmar la fecha de emisión del certificado de IA: el diploma dice 31 de julio de 2024, el brief decía agosto de 2024.",
] as const;
