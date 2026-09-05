"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` hace que Motion respete `prefers-reduced-motion` en
 * todo el árbol: desactiva los cambios de posición y escala, y deja pasar la
 * opacidad. Así el contenido sigue apareciendo y nadie se marea.
 *
 * Los hijos llegan como prop, así que se siguen renderizando en el servidor.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
