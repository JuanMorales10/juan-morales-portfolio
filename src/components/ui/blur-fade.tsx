"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
  type UseInViewOptions,
  type Variants,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

// Blur Fade: componente de 21st.dev, de Magic UI (Dillion Verma).
// https://21st.dev/magicui · https://magicui.design/docs/components/blur-fade
//
// Entrada corta: el elemento aparece desenfocado y un poco corrido, y se asienta.
// Lo comparten varias secciones del sitio (IA, Formación, Capacidades), así que
// la API es la del original y no se toca: `delay`, `duration`, `offset`,
// `direction`, `inView`, `inViewMargin`, `blur`, `variant`.
//
// Qué se cambió del original y por qué:
//
// 1. Colores: no traía ninguno, no hay nada que adaptar a la paleta.
// 2. Movimiento reducido. `MotionConfig reducedMotion="user"` ya anula el
//    desplazamiento, pero no el `filter`, y un desenfoque que se resuelve es
//    movimiento para quien pidió que no lo haya. Con `useReducedMotion()` el
//    `filter` pasa con duración cero y queda un fundido de opacidad. Se ajusta
//    la transición y no las variantes a propósito: las variantes se serializan
//    al HTML del servidor, donde el hook devuelve `null`, y cambiarlas según
//    ese valor no coincidiría con el primer render del cliente.
// 3. Formato del repo (punto y coma, comillas dobles) y tipos importados de
//    `react` en vez del namespace global.

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps extends MotionProps {
  children: ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

const getFilter = (v: Variants[string]) => (typeof v === "function" ? undefined : v.filter);

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const distance = direction === "right" || direction === "down" ? -offset : offset;

  const defaultVariants: Variants = {
    hidden: {
      [axis]: distance,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };
  const combinedVariants = variant ?? defaultVariants;

  const hiddenFilter = getFilter(combinedVariants.hidden);
  const visibleFilter = getFilter(combinedVariants.visible);

  const shouldTransitionFilter =
    hiddenFilter != null && visibleFilter != null && hiddenFilter !== visibleFilter;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
          ...(shouldTransitionFilter ? { filter: { duration: reduceMotion ? 0 : duration } } : {}),
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
