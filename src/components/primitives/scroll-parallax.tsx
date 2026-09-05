"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Desplazamiento suave atado al scroll, para el teléfono sobre todo.
 *
 * En una pantalla táctil no hay puntero que pase por encima de nada: lo único
 * que la persona hace es bajar. Este primitivo convierte ese gesto en
 * movimiento. Mientras el bloque cruza la ventana, el hijo se desplaza de
 * `range[0]` a `range[1]` píxeles en vertical. Con valores chicos (de 24 a 60)
 * una captura parece flotar dentro de su marco; con valores más grandes, dos
 * elementos vecinos se separan a distinta velocidad.
 *
 * Solo `transform`, así que corre en el compositor y no dispara layout. Con
 * movimiento reducido no se desplaza nada: el hijo queda quieto donde está.
 *
 * Si el hijo tiene que recortarse (por ejemplo una imagen dentro de `.screen`),
 * envolvé este componente con `overflow-hidden` y dale al hijo un poco más de
 * alto que al marco, o el desplazamiento deja ver el fondo.
 */
export function ScrollParallax({
  children,
  range = [-24, 24],
  className,
  as = "div",
}: {
  children: ReactNode;
  /** Píxeles de desplazamiento al entrar y al salir de la ventana. */
  range?: [number, number];
  className?: string;
  as?: "div" | "figure" | "li" | "span";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const still = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : range);

  /* Las cuatro etiquetas aceptan las mismas props de Motion; solo difieren en
     el tipo del `ref`, y para medir el scroll alcanza con `HTMLElement`. Se
     tipa como `motion.div` para no ramificar el JSX por etiqueta. */
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag ref={ref} className={className} style={{ y }}>
      {children}
    </Tag>
  );
}
