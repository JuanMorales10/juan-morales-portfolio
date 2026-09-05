import type { ReactNode } from "react";

import { showPending } from "@/content/site";

/**
 * Recordatorio de un dato que falta.
 *
 * Solo se renderiza en desarrollo. En producción devuelve `null`, así que el
 * sitio nunca publica un marcador ni un enlace roto, y Juan igual ve qué le
 * falta cada vez que levanta el proyecto.
 */
export function PendingNote({ children }: { children: ReactNode }) {
  if (!showPending) return null;

  return (
    <span
      className="text-paper-faint inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--hairline-strong)] px-3 py-1"
      title="Visible solo en desarrollo: falta este dato."
    >
      <span className="bg-paper-faint h-1.5 w-1.5 rounded-full" aria-hidden="true" />
      <span className="meta">Pendiente: {children}</span>
    </span>
  );
}
