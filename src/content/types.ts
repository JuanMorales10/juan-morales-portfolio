/**
 * Tipos del contenido profesional.
 *
 * Todo el texto del sitio vive en `src/content`. Los componentes no escriben
 * copy: lo reciben tipado desde acá. Editar el sitio es editar estos archivos.
 */

/** Marcador de dato que Juan todavía no entregó. Ver `isPlaceholder`. */
export type Placeholder = `[${string}]`;

/** Valor que puede estar pendiente de completar. */
export type Pending<T extends string = string> = T | Placeholder;

export interface ExternalLink {
  label: string;
  href: string;
  /** Texto corto que se imprime entre paréntesis en la versión papel del CV. */
  printAs?: string;
}

export interface Role {
  id: string;
  company: string;
  companyUrl?: string;
  title: string;
  /** Formato ISO corto, `YYYY-MM`. Se usa para ordenar y para el JSON-LD. */
  start: string;
  /** `null` cuando el rol sigue vigente. */
  end: string | null;
  /** Cómo se muestra el período en pantalla. */
  period: string;
  summary: string;
  /** Responsabilidades concretas. Sin resultados numéricos inventados. */
  responsibilities: string[];
  /** Slug del caso de estudio asociado, si existe. */
  project?: string;
}

export interface Credential {
  id: string;
  institution: string;
  program: string;
  period: string;
  /** Detalles verificables: duración, calificación, contenidos. */
  details: string[];
  /** Se muestra como nota al pie del ítem. */
  note?: string;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  /** Una frase que explica por qué este grupo existe, no un adorno. */
  intro: string;
  items: string[];
}

export interface ProcessStep {
  id: string;
  title: string;
  body: string;
}

export type ProjectStatus = "published" | "draft";

export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Pie de foto visible. */
  caption?: string;
}

/** Un área del producto: título, explicación y la captura que la muestra. */
export interface ProductArea {
  id: string;
  label: string;
  title: string;
  body: string;
  shot: Shot;
}

export interface CaseBlock {
  id: string;
  heading: string;
  paragraphs: string[];
  /** Ítems opcionales que se listan debajo del texto. */
  bullets?: string[];
}

/** Qué relación tiene Juan con el proyecto. Se muestra tal cual. */
export type ProjectKind = "producto propio" | "para un cliente" | "herramienta interna";

export interface Project {
  slug: string;
  status: ProjectStatus;
  name: string;
  /** Rol de Juan en el proyecto, tal como se muestra en la ficha. */
  role: string;
  kind: ProjectKind;
  /** Para quién se hizo, si no es un producto propio. */
  client?: string;
  /**
   * Color del proyecto, en hex. Se usa solo para el brillo detrás de sus
   * capturas y para el borde de su tarjeta; el jade sigue siendo el acento del
   * sitio. Sale de la marca real del producto, no se inventa.
   */
  accent: string;
  /** Período en formato ISO corto, para ordenar. `end` null si sigue. */
  start: string;
  end: string | null;
  /** Una línea. Es lo que se lee en el índice de proyectos. */
  tagline: string;
  /** Párrafo de presentación en la home. */
  summary: string;
  year: string;
  /** Etiquetas cortas de disciplina. Máximo cuatro. */
  disciplines: string[];
  stack: string[];
  links: ExternalLink[];
  /** Imagen de portada del proyecto. */
  cover: Shot;
  /** Bloques narrativos del caso de estudio. */
  blocks: CaseBlock[];
  /** Áreas del producto para el recorrido con scroll. Vacío si no aplica. */
  areas: ProductArea[];
  /** Galería complementaria al final del caso. */
  gallery: Shot[];
  /** Aviso sobre la naturaleza de las capturas. Se imprime junto a ellas. */
  shotsDisclaimer?: string;
  seo: {
    title: string;
    description: string;
  };
}
