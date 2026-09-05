"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

// Spotlight, componente de 21st.dev, de Aceternity UI (Manu Arora).
// https://ui.aceternity.com/components/spotlight-new
//
// Dos haces de luz cónicos que entran desde las esquinas superiores y oscilan
// despacio. Acá barren detrás del titular del hero, en `sections/hero.tsx`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **Luz jade.** Los degradados venían en azul (`hsla(210, ...)`). El sitio
//    tiene un solo acento, así que los tres se arman con `--color-jade-glow` y
//    `--color-jade` mezclados con transparente. Nada violeta ni azul.
// 2. **Sin `z-40`.** Los haces tenían índice alto y pintaban por encima del
//    texto. Ahora quedan en el fondo: el encabezado del hero es quien sube.
// 3. **Barrido finito.** La oscilación original no terminaba nunca
//    (`repeat: Infinity`) y el sistema no admite nada infinito fuera de las
//    marquesinas: acá los haces hacen `sweeps` barridos lentos de ida y vuelta
//    y se quedan quietos. Con `prefers-reduced-motion` no barren: solo
//    aparecen con un fundido de opacidad, que es lo único que ese ajuste permite.
// 4. **`aria-hidden` y `className`.** Es decoración pura, y el que lo monta
//    decide dónde y con qué alto.

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  /** Segundos que dura cada barrido de ida y vuelta. */
  duration?: number;
  xOffset?: number;
  /** Cuántos barridos hace antes de quedarse quieto. */
  sweeps?: number;
  className?: string;
};

const jadeFirst =
  "radial-gradient(68.54% 68.72% at 55.02% 31.46%, color-mix(in oklab, var(--color-jade-glow) 16%, transparent) 0, color-mix(in oklab, var(--color-jade) 6%, transparent) 50%, transparent 80%)";
const jadeSecond =
  "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-jade-glow) 12%, transparent) 0, color-mix(in oklab, var(--color-jade) 4%, transparent) 80%, transparent 100%)";
const jadeThird =
  "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-jade-glow) 8%, transparent) 0, color-mix(in oklab, var(--color-jade) 3%, transparent) 80%, transparent 100%)";

export const Spotlight = ({
  gradientFirst = jadeFirst,
  gradientSecond = jadeSecond,
  gradientThird = jadeThird,
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
  sweeps = 2,
  className,
}: SpotlightProps = {}) => {
  const still = useReducedMotion();

  // Cada pasada es ida y vuelta (`x: [0, xOffset, 0]`); `repeat` cuenta las extra.
  const sweep = {
    duration,
    repeat: Math.max(0, Math.round(sweeps) - 1),
    ease: "easeInOut" as const,
  };

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className={cn("pointer-events-none absolute inset-0 h-full w-full overflow-hidden", className)}
    >
      <motion.div
        animate={still ? undefined : { x: [0, xOffset, 0] }}
        transition={sweep}
        className="pointer-events-none absolute top-0 left-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </motion.div>

      <motion.div
        animate={still ? undefined : { x: [0, -xOffset, 0] }}
        transition={sweep}
        className="pointer-events-none absolute top-0 right-0 h-screen w-screen"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </motion.div>
    </motion.div>
  );
};
