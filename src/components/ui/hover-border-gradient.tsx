"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import type { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Hover Border Gradient: componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://21st.dev/aceternity · https://ui.aceternity.com/components/hover-border-gradient
//
// Un borde de un píxel por el que gira un punto de luz; al pasar el puntero, la
// luz se expande y ocupa todo el borde. Acá enmarca el cierre de "IA como
// herramienta de trabajo" (sections/ai-work.tsx): una frase, no un botón, por
// eso se usa con `as="div"`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. Paleta. La luz era blanca y el realce del hover un azul (#3275F8). Acá es
//    jade sobre night-800: el único acento del sitio, sin azules. El anillo en
//    reposo pasa de `bg-white/20` a `bg-jade/30`.
// 2. Colores en hex y no como `var()`. Motion interpola un degradado solo si los
//    colores son literales que pueda leer; son los mismos valores que
//    `--color-jade-glow` y `--color-jade` en globals.css. Si cambian allá,
//    cambian acá.
// 3. Radio heredado. El original fijaba `rounded-full` y un `rounded-[100px]`
//    interno pensados para una píldora. Acá el radio lo decide quien llama vía
//    `containerClassName` y las capas internas lo heredan.
// 4. El giro no es infinito. Es un intervalo que cambia de estado cada
//    `duration` segundos; el original lo dejaba corriendo para siempre. Acá
//    corre solo mientras el borde está en pantalla (`useInView`) y el puntero
//    no está encima. Con `prefers-reduced-motion` no arranca y la capa de luz
//    se oculta por CSS (`motion-reduce:hidden`): queda el anillo jade quieto.
//    La capa se renderiza siempre, porque decidir el markup con
//    `useReducedMotion()` rompe la hidratación (devuelve `null` en el servidor
//    y un booleano en el cliente).
// 5. Lint: el efecto declara sus dependencias, la rotación es una función pura
//    afuera del componente y se fue el parámetro `event` sin usar.

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const DIRECTIONS: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];

function rotateDirection(current: Direction, clockwise: boolean): Direction {
  const index = DIRECTIONS.indexOf(current);
  const next = clockwise
    ? (index - 1 + DIRECTIONS.length) % DIRECTIONS.length
    : (index + 1) % DIRECTIONS.length;
  return DIRECTIONS[next];
}

const GLOW = "#4fd1b3";
const GLOW_CLEAR = "rgba(79, 209, 179, 0)";
const JADE = "#2a9a82";

const movingMap: Record<Direction, string> = {
  TOP: `radial-gradient(20.7% 50% at 50% 0%, ${GLOW} 0%, ${GLOW_CLEAR} 100%)`,
  LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${GLOW} 0%, ${GLOW_CLEAR} 100%)`,
  BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${GLOW} 0%, ${GLOW_CLEAR} 100%)`,
  RIGHT: `radial-gradient(16.2% 41.2% at 100% 50%, ${GLOW} 0%, ${GLOW_CLEAR} 100%)`,
};

const highlight = `radial-gradient(75% 181.2% at 50% 50%, ${JADE} 0%, ${GLOW_CLEAR} 100%)`;

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: PropsWithChildren<
  {
    as?: ElementType;
    containerClassName?: string;
    className?: string;
    /** Segundos que tarda la luz en pasar de un lado al siguiente. */
    duration?: number;
    clockwise?: boolean;
  } & HTMLAttributes<HTMLElement>
>) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  useEffect(() => {
    if (hovered || reduceMotion || !inView) return;
    const interval = setInterval(() => {
      setDirection((previous) => rotateDirection(previous, clockwise));
    }, duration * 1000);
    return () => clearInterval(interval);
  }, [hovered, reduceMotion, inView, clockwise, duration]);

  return (
    <Tag
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex h-min w-fit flex-col flex-nowrap items-center justify-center overflow-visible rounded-full bg-jade/30 p-px transition-colors duration-500 hover:bg-jade/50",
        containerClassName,
      )}
      {...props}
    >
      <div className={cn("z-10 w-auto rounded-[inherit] bg-night-800 px-4 py-2 text-paper", className)}>
        {children}
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-0 flex-none overflow-hidden rounded-[inherit] motion-reduce:hidden"
        style={{ filter: "blur(2px)" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />

      <div aria-hidden="true" className="absolute inset-[2px] z-1 flex-none rounded-[inherit] bg-night-800" />
    </Tag>
  );
}
