"use client";

import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

// Moving Border, componente de 21st.dev, de Aceternity UI (Manu Arora).
// https://21st.dev (registro de Aceternity) · https://ui.aceternity.com/components/moving-border
//
// Un botón con un punto de luz que recorre el borde. Acá es el llamado a la
// acción de Contacto, la última pantalla del sitio: sobre noche, un botón
// quieto se perdería entre los haces del fondo.
//
// Qué se cambió del original y por qué (si se vuelve a bajar del registro,
// hay que reaplicarlo):
//
// 1. **Tipos.** Venía con `as?: any`, `[key: string]: any` y un `useRef()` sin
//    argumento que no compila en TypeScript estricto. `as` pasa a
//    `React.ElementType`, el resto de las props son las de un ancla o botón
//    y el ref del rectángulo queda tipado.
// 2. **Paleta.** El punto de luz era celeste (`#0ea5e9`) y el interior
//    `slate-900` con borde `slate-800`. Ahora el punto es jade-glow y el
//    interior night-800 con texto papel y hairline: la superficie estándar del
//    sitio. Los colores salen de los tokens, no de hex sueltos.
// 3. **Tamaño.** El original fijaba `h-16 w-40 text-xl`. Un ancho fijo no
//    sirve para textos de largo distinto: el contenedor es `inline-flex` y el
//    tamaño lo da el contenido (o `containerClassName`).
// 4. **Movimiento reducido.** El recorrido es infinito. Con
//    `prefers-reduced-motion` el punto se queda fijo en un lugar del borde,
//    como un reflejo, en vez de dar vueltas.

type ButtonProps = {
  borderRadius?: string;
  children: React.ReactNode;
  /** Etiqueta o componente a renderizar. Para un enlace, `as="a"` con `href`. */
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  /** Milisegundos que tarda el punto en dar la vuelta completa. */
  duration?: number;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLElement>, "children" | "className">;

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  style,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn(
        "relative inline-flex overflow-hidden bg-transparent p-px",
        containerClassName,
      )}
      style={{ borderRadius, ...style }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
        aria-hidden="true"
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(var(--color-jade-glow)_40%,transparent_60%)] opacity-80",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-[var(--hairline)] bg-night-800 text-sm text-paper",
          className,
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}

type MovingBorderProps = {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
} & Omit<React.SVGProps<SVGSVGElement>, "children" | "rx" | "ry">;

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);
  const reduced = useReducedMotion();

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (!length) return;

    // Con movimiento reducido el punto queda quieto sobre el borde superior.
    if (reduced) {
      progress.set(length * 0.12);
      return;
    }

    const pxPerMillisecond = length / duration;
    progress.set((time * pxPerMillisecond) % length);
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
