"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

// Shine Border: componente de 21st.dev, de Magic UI (Dillion Verma).
// https://21st.dev/community/components/s/shine-border · https://magicui.design/docs/components/shine-border
//
// Un borde por el que corre una luz. Se apoya sobre un padre `relative` con
// esquinas redondeadas y dibuja solo el anillo: la máscara `content-box` xor
// deja pasar únicamente el grosor del borde. Acá enmarca la portada del
// proyecto destacado en la sección de proyectos de la home.
//
// Qué se cambió del original y por qué:
//
// 1. **La animación.** El original anima `background-position` con la clase
//    `animate-shine`, que exige declarar el keyframe en el CSS global; sin eso
//    el borde queda quieto. Acá la luz es un `conic-gradient` que gira con
//    `transform: rotate`, animado por Motion: solo compositor y sin CSS global.
// 2. **Movimiento reducido y pausa.** Es un bucle infinito, el único del sitio
//    además de los marquees, y el brief lo pide para el destacado. Con
//    `useReducedMotion()` el degradado queda fijo, con los dos brillos en
//    reposo; y la luz corre con `animate()` sobre un `MotionValue` para poder
//    pausarla cuando el borde sale de la pantalla (`useInView`) y seguir desde
//    donde estaba al volver, sin reiniciar.
// 3. **Color por defecto.** `#000000` sobre noche es invisible; pasa a jade.
// 4. **Tipos.** El `style` ya no se castea a `CSSProperties` a la fuerza: las
//    variables CSS del original no hacían falta.

interface ShineBorderProps extends HTMLAttributes<HTMLDivElement> {
  /** Grosor del borde, en píxeles. */
  borderWidth?: number;
  /** Segundos que tarda la luz en dar la vuelta completa. */
  duration?: number;
  /** Un color o varios; con varios, la luz pasa de uno a otro. */
  shineColor?: string | string[];
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "var(--color-jade)",
  className,
  style,
  ...props
}: ShineBorderProps) {
  const quieto = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useInView(ref);
  const rotate = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (quieto) return;

    const animation = animate(rotate, [0, 360], {
      duration,
      repeat: Infinity,
      ease: "linear",
    });
    controls.current = animation;

    return () => {
      animation.stop();
      controls.current = null;
    };
  }, [quieto, duration, rotate]);

  // Fuera de pantalla la luz se detiene donde está; al volver, sigue.
  useEffect(() => {
    const animation = controls.current;
    if (!animation) return;
    if (visible) animation.play();
    else animation.pause();
  }, [visible, quieto, duration]);

  const colors = Array.isArray(shineColor) ? shineColor : [shineColor];
  const stops = colors.join(", ");

  // Dos luces enfrentadas; entre una y otra el borde queda transparente.
  const gradient = `conic-gradient(from 0deg, transparent 0deg, ${stops}, transparent 110deg, transparent 180deg, ${stops}, transparent 290deg, transparent 360deg)`;

  const ring: CSSProperties = {
    padding: `${borderWidth}px`,
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={ring}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      {...props}
    >
      {/* Un cuadrado del doble del tamaño, centrado: así al girar cubre el
          rectángulo entero sin dejar esquinas sin luz. */}
      <motion.div
        className="absolute -inset-1/2 will-change-transform"
        style={{ backgroundImage: gradient, rotate }}
      />
    </div>
  );
}
