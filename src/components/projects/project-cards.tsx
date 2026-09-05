import { FocusCards, type FocusCard, type FocusFilter } from "@/components/ui/focus-cards";
import type { Project, ProjectKind } from "@/content/types";

/**
 * Grilla de proyectos.
 *
 * Traduce los proyectos del contenido a las tarjetas de `FocusCards` y arma,
 * si se pide, el filtro por tipo. La traducción pasa acá, del lado del
 * servidor, para que al cliente viaje solo lo que la tarjeta muestra y no los
 * bloques enteros del caso de estudio.
 *
 * La usan la home (los proyectos que no son el destacado, sin filtro) y el
 * índice /proyectos (todos, con filtro).
 */

/** Orden fijo de los tipos: los botones del filtro no cambian de lugar. */
const KIND_ORDER: ProjectKind[] = ["producto propio", "para un cliente", "herramienta interna"];

export function projectCard(project: Project): FocusCard {
  return {
    id: project.slug,
    title: project.name,
    kind: project.kind,
    tagline: project.tagline,
    href: `/proyectos/${project.slug}`,
    accent: project.accent,
    src: project.cover.src,
    alt: project.cover.alt,
  };
}

/** "producto propio" se muestra como "Producto propio" en el botón. */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function ProjectCards({
  projects,
  headingLevel = 3,
  columns = 2,
  filterable = false,
  className,
}: {
  projects: Project[];
  /** h3 dentro de la home, h2 en el índice, que tiene su propio h1. */
  headingLevel?: 2 | 3;
  columns?: 2 | 3;
  filterable?: boolean;
  className?: string;
}) {
  const cards = projects.map(projectCard);

  // Solo los tipos que existen: un filtro que deja la grilla vacía no sirve.
  const kinds = KIND_ORDER.filter((kind) => projects.some((project) => project.kind === kind));

  const filter: FocusFilter | undefined =
    filterable && kinds.length > 1
      ? {
          label: "Filtrar por tipo de proyecto",
          allLabel: "Todos",
          options: kinds.map((kind) => ({ value: kind, label: capitalize(kind) })),
        }
      : undefined;

  return (
    <FocusCards
      cards={cards}
      headingLevel={headingLevel}
      columns={columns}
      filter={filter}
      className={className}
    />
  );
}
