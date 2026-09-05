import type { Transition, Variants } from "motion/react";

/**
 * Vocabulario de movimiento del sitio.
 *
 * Una sola curva para las entradas y una sola para el feedback físico. Que todo
 * se mueva con la misma inercia es lo que hace que parezca un producto y no una
 * suma de animaciones.
 *
 * Nada de esto anima `width`, `height`, `top` ni `left`: solo `transform` y
 * `opacity`, para que el compositor haga el trabajo.
 */

/** Salida exponencial: arranca rápido y frena largo. Entradas y reveals. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/** Un poco menos dramática. Cambios de estado y layout. */
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export const enterTransition: Transition = {
  duration: 0.8,
  ease: easeOutExpo,
};

export const layoutTransition: Transition = {
  duration: 0.55,
  ease: easeOutQuint,
};

/** Resorte para hover y press. Sin rebote visible, solo peso. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.8,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 0.6,
};

/**
 * Contenedor con stagger. `delayChildren` deja respirar antes de la secuencia.
 */
export function staggerParent(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Sube y aparece. El desplazamiento es corto a propósito. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const riseInSmall: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: easeOutExpo } },
};

/**
 * Revelado por línea de título. La línea sube desde detrás de una máscara,
 * así que el contenedor necesita `overflow: hidden`.
 */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1.05, ease: easeOutExpo },
  },
};

/** Imagen que entra con una escala mínima. Más que esto se nota y molesta. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: easeOutExpo },
  },
};

/** Margen de disparo del scroll reveal: entra cuando ya se ve de verdad. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportOnceLoose = { once: true, amount: 0.1 } as const;
