import type { Project } from "../types";
import { ahorrito } from "./ahorrito";
import { llavero } from "./llavero";
import { muchoPeluqueria } from "./mucho-peluqueria";
import { portalPoltrona } from "./portal-poltrona";
import { rienda } from "./rienda";

/**
 * Registro de proyectos, en el orden en que se muestran.
 *
 * Para sumar uno nuevo: crear `src/content/projects/<slug>.ts` con la misma
 * forma que `rienda.ts`, importarlo acá y agregarlo a la lista. Mientras esté
 * en `status: "draft"` no aparece en producción ni en el sitemap, así se puede
 * escribir tranquilo con el sitio publicado.
 *
 * El orden es de lectura, no de importancia: primero el producto vivo que Juan
 * dirige hoy, después los otros dos productos propios y los dos trabajos para
 * terceros, y al final el proyecto del que salieron los demás.
 */
const registry: Project[] = [rienda, llavero, muchoPeluqueria, portalPoltrona, ahorrito];

/** Solo lo publicable. En desarrollo se ven también los borradores. */
export const projects: Project[] = registry.filter(
  (project) => project.status === "published" || process.env.NODE_ENV !== "production",
);

/** Lo que se indexa y se linkea desde afuera: nunca incluye borradores. */
export const publishedProjects: Project[] = registry.filter(
  (project) => project.status === "published",
);

export const featuredProject = projects[0] ?? rienda;

/** Los demás proyectos, sin el destacado. */
export const otherProjects: Project[] = projects.filter(
  (project) => project.slug !== featuredProject.slug,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export { ahorrito, llavero, muchoPeluqueria, portalPoltrona, rienda };
