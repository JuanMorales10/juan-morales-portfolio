"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

// Lens: componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://21st.dev/community/components/s/lens · https://ui.aceternity.com/components/lens
//
// Una lupa que sigue al puntero sobre una imagen: la misma imagen, duplicada y
// escalada, recortada con una máscara circular en la posición del mouse. Acá
// va sobre la portada del proyecto destacado, para mirar el detalle de la
// pantalla sin abrir nada.
//
// Qué se cambió del original y por qué:
//
// 1. **Sin re-render por movimiento.** El original guardaba la posición del
//    mouse en `useState`, así que cada píxel recorrido volvía a renderizar la
//    imagen dos veces. Acá la posición vive en dos `MotionValue` y la máscara
//    se arma con `useMotionTemplate`: cambia el estilo y nada más.
// 2. **Forma.** `rounded-lg` fijo pasa a `rounded-[inherit]`, para que la lupa
//    respete el radio del `.screen` que la envuelve. Se quitó el `z-20` del
//    contenedor, que peleaba con el borde animado que va encima.
// 3. **Táctil.** En pantallas sin puntero la lupa no se dibuja: un toque la
//    dejaba abierta y fija hasta tocar otra cosa.
// 4. **Firma.** Se quitó `isFocusing`, que estaba declarada y no se usaba.
// 5. **Accesibilidad.** La lupa duplica a sus hijos (la imagen con su `alt`);
//    la copia va con `aria-hidden` para que no se anuncie dos veces.
//
// Quien la use tiene que dejar el `SharedElement` (o cualquier
// `view-transition-name`) por fuera: los hijos se renderizan dos veces y un
// nombre duplicado cancela la transición.

interface LensProps {
  children: ReactNode;
  zoomFactor?: number;
  /** Diámetro de la lupa, en píxeles. */
  lensSize?: number;
  /** Posición fija de la lupa cuando `isStatic` es true. */
  position?: { x: number; y: number };
  isStatic?: boolean;
  /** Estado controlado desde afuera, si hace falta coordinarlo con otra cosa. */
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
  className?: string;
}

export function Lens({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  position,
  isStatic = false,
  hovering,
  setHovering,
  className,
}: LensProps) {
  const [localHovering, setLocalHovering] = useState(false);
  const isHovering = hovering ?? localHovering;
  const setIsHovering = setHovering ?? setLocalHovering;

  const x = useMotionValue(position?.x ?? 200);
  const y = useMotionValue(position?.y ?? 150);
  const mask = useMotionTemplate`radial-gradient(circle ${lensSize / 2}px at ${x}px ${y}px, black 100%, transparent 100%)`;
  const origin = useMotionTemplate`${x}px ${y}px`;

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isStatic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const lens = (
    <motion.div
      key="lupa"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.58 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 overflow-hidden [@media(hover:none)]:hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask, transformOrigin: origin }}
    >
      <motion.div className="absolute inset-0" style={{ scale: zoomFactor, transformOrigin: origin }}>
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <div
      className={cn("relative overflow-hidden rounded-[inherit]", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isStatic ? lens : <AnimatePresence>{isHovering ? lens : null}</AnimatePresence>}
    </div>
  );
}
