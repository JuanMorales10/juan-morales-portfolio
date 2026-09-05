"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { riseIn, staggerParent, viewportOnce, viewportOnceLoose } from "@/lib/motion";

/**
 * Los componentes de Motion se declaran una sola vez, acá afuera.
 *
 * Crearlos dentro del render (con `motion.create(tag)`) devuelve un componente
 * nuevo en cada pasada y React desmonta y vuelve a montar el subárbol, con lo
 * cual la animación se reinicia sola. Un mapa fijo también hace que la etiqueta
 * quede tipada: si alguien pide una que no está, el error salta al compilar.
 */
const TAGS = {
  div: motion.div,
  p: motion.p,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  figure: motion.figure,
  figcaption: motion.figcaption,
  article: motion.article,
  section: motion.section,
  span: motion.span,
  blockquote: motion.blockquote,
} as const;

export type RevealTag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Etiqueta HTML resultante. Por defecto `div`. */
  as?: RevealTag;
  /** Retraso de entrada, en segundos. */
  delay?: number;
  /** `loose` dispara antes: para bloques altos que no entran completos. */
  threshold?: "default" | "loose";
};

/**
 * Aparición al entrar en el viewport. Una sola vez, corta, y solo con
 * `transform` y `opacity`.
 *
 * Con `prefers-reduced-motion` el `MotionRoot` cancela el desplazamiento y
 * queda un fundido; el contenido nunca depende de la animación para verse.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  threshold = "default",
}: RevealProps) {
  const Component = TAGS[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={threshold === "loose" ? viewportOnceLoose : viewportOnce}
      variants={riseIn}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Igual que `Reveal`, pero encadena a los hijos que usen `RevealItem`.
 * Sirve para listas donde el orden de lectura importa.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  threshold = "default",
}: RevealProps & { stagger?: number }) {
  const Component = TAGS[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={threshold === "loose" ? viewportOnceLoose : viewportOnce}
      variants={staggerParent(stagger, delay)}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: Omit<RevealProps, "delay" | "threshold">) {
  const Component = TAGS[as];

  return (
    <Component className={className} variants={riseIn}>
      {children}
    </Component>
  );
}
