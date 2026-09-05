"use client";

import { stagger, useAnimate, useReducedMotion } from "motion/react";
import { type CSSProperties, Fragment, useEffect } from "react";

import { cn } from "@/lib/utils";

// Text Generate Effect, componente de 21st.dev, de Aceternity UI (Manu Arora).
// https://ui.aceternity.com/components/text-generate-effect
//
// Las palabras aparecen una a una, desenfocadas y subiendo la opacidad. Acá
// escribe el titular del hero, en `sections/hero.tsx`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **Solo `span`.** El original envolvía el texto en tres `div` con
//    `font-bold`, `text-2xl` y `mt-4`, lo que impedía usarlo dentro de un
//    `<h1>` (un `div` dentro de un encabezado no es HTML válido) y traía su
//    propia tipografía. Ahora devuelve solo `span`, y el tamaño, el peso y el
//    color los pone el encabezado que lo contiene.
// 2. **Líneas.** `words` acepta además una lista de líneas, porque el titular
//    del sitio viene partido a propósito. Cada línea es un `span` en bloque.
// 3. **Una línea con brillo.** `glow` marca la línea que lleva `.text-glow`.
//    Esa línea anima entera, no por palabra: el degradado se recorta al texto
//    del mismo elemento que anima, y partirla lo cortaría en trozos.
// 4. **El texto está siempre en el DOM.** El estado inicial es solo
//    `opacity: 0` en `style`, no en una clase, para que el `<noscript>` del
//    sitio lo neutralice cuando no corre JavaScript. El desenfoque no va ahí:
//    ese fallback fuerza la opacidad pero no el `filter`, y sin JavaScript el
//    titular quedaría borroso. Entra como primer fotograma de la animación,
//    cuando la palabra todavía es invisible, así que nadie lo ve saltar.
// 5. **Movimiento reducido.** Con `prefers-reduced-motion` todo aparece de una,
//    sin escalonado ni desenfoque.
// 6. **Colores y dependencias.** Se quitaron `dark:text-white text-black` (el
//    encabezado ya trae el color) y el efecto ya no depende de `scope.current`,
//    que ESLint marcaba como lectura de ref en render.

export const TextGenerateEffect = ({
  words,
  glow,
  className,
  filter = true,
  duration = 0.5,
  step = 0.08,
  delay = 0.15,
}: {
  /** Un texto (se parte por espacios) o una lista de líneas. */
  words: string | readonly string[];
  /** Índice de la línea que lleva `.text-glow`. Una sola por titular. */
  glow?: number;
  className?: string;
  /** Con desenfoque de entrada. */
  filter?: boolean;
  /** Duración de cada palabra, en segundos. */
  duration?: number;
  /** Escalonado entre palabras, en segundos. */
  step?: number;
  /** Espera antes de la primera palabra, en segundos. */
  delay?: number;
}) => {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const still = useReducedMotion();

  useEffect(() => {
    const controls = animate(
      "[data-word]",
      still || !filter
        ? { opacity: 1, filter: "none" }
        : { opacity: [0, 1], filter: ["blur(10px)", "blur(0px)"] },
      still
        ? { duration: 0 }
        : { duration, delay: stagger(step, { startDelay: delay }) },
    );
    return () => controls.stop();
  }, [animate, still, filter, duration, step, delay]);

  const lines = typeof words === "string" ? [words] : words;
  const hidden: CSSProperties = { opacity: 0 };

  return (
    <span ref={scope} className={cn("block", className)}>
      {lines.map((line, lineIndex) => {
        if (lineIndex === glow) {
          return (
            <span key={line} className="block">
              <span data-word className="text-glow" style={hidden}>
                {line}
              </span>
            </span>
          );
        }

        const parts = line.split(" ");
        return (
          <span key={line} className="block">
            {parts.map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                <span data-word style={hidden}>
                  {word}
                </span>
                {wordIndex < parts.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        );
      })}
    </span>
  );
};
