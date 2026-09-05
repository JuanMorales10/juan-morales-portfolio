import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Surface = "bone" | "bone-alt" | "ink";

/**
 * Los nombres quedaron de la v1 para no romper a quien ya los usa, pero en la
 * v2 el sitio es noche: `ink` es el fondo del sitio y el valor por defecto,
 * `bone-alt` es la superficie alterna (un escalón más clara) y `bone` es el
 * único panel de hueso real, que invierte los tokens de contexto vía
 * `data-surface="bone"` (ver globals.css).
 */
const surfaceClass: Record<Surface, string> = {
  ink: "bg-night-900 text-paper",
  "bone-alt": "bg-night-800 text-paper",
  bone: "bg-bone-100 text-ink",
};

/**
 * Envoltura semántica de una sección de la home.
 *
 * No impone composición interna a propósito: cada sección del sitio se arma
 * distinto, que es justamente lo que evita el efecto plantilla. Lo único que
 * unifica es el ritmo vertical, el ancho máximo y la superficie.
 */
export function Section({
  id,
  children,
  surface = "ink",
  className,
  tight = false,
  labelledBy,
  bleed = false,
}: {
  id?: string;
  children: ReactNode;
  surface?: Surface;
  className?: string;
  /** Espaciado vertical reducido, para secciones que continúan a la anterior. */
  tight?: boolean;
  /** `id` del encabezado que nombra la sección, para lectores de pantalla. */
  labelledBy?: string;
  /** Sin `.shell`: la sección administra su propio ancho. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-surface={surface === "bone" ? "bone" : undefined}
      className={cn(
        surfaceClass[surface],
        tight
          ? "py-[var(--spacing-section-sm)]"
          : "py-[var(--spacing-section)]",
        className,
      )}
    >
      {bleed ? children : <div className="shell">{children}</div>}
    </section>
  );
}

/** Rótulo de sección en monoespaciada, con una regla que lo ancla a la grilla. */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("meta hairline-t pt-3", className)}>
      <span>{children}</span>
    </p>
  );
}
