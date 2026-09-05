"use client";

import { AnimatePresence, motion, type MotionProps, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// Word Rotate, componente de 21st.dev, de Magic UI.
// https://magicui.design/docs/components/word-rotate
//
// Una palabra que cada tanto sale por abajo y entra otra por arriba. Está
// adaptado y listo, pero por ahora no se monta en ninguna sección: su rotación
// es infinita y el sistema solo admite eso en las marquesinas. Si algún día se
// usa, el lugar natural es un rótulo, nunca el titular.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **`h1` a `span`.** El original renderizaba un `motion.h1` por palabra: en
//    una página con su propio `<h1>` eso duplica el encabezado principal cada
//    vez que rota. Ahora es un `span` y el nivel de título lo decide el padre.
// 2. **Movimiento reducido.** Con `prefers-reduced-motion` se queda en la
//    primera palabra, sin intervalo ni transición.
// 3. **`words` tipado como lista de solo lectura**, para poder pasarle las
//    tuplas `as const` del contenido.

interface WordRotateProps {
  words: readonly string[];
  /** Milisegundos entre palabras. */
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const still = useReducedMotion();
  // Depende de la cantidad y no de la lista: una lista literal cambia de
  // identidad en cada render y reiniciaría el intervalo todo el tiempo.
  const count = words.length;

  useEffect(() => {
    if (still || count < 2) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % count);
    }, duration);

    return () => clearInterval(interval);
  }, [count, duration, still]);

  const word = words[still ? 0 : index];

  return (
    <span className="block overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.span key={word} className={cn("block", className)} {...motionProps}>
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
