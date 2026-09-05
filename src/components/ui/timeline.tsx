"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

// Timeline: componente de 21st.dev, de Aceternity UI (Manu Arora).
// https://ui.aceternity.com/components/timeline
//
// Se usa en la sección Recorrido (sections/experience.tsx): cada entrada es un
// rol, el título es el período y el contenido lo arma la sección. Se conserva
// la idea, un riel vertical que se va rellenando a medida que se baja y un
// título que queda pegado al costado mientras se lee la entrada.
//
// Qué se cambió del original y por qué. Si algún día se actualiza desde el
// registro, hay que volver a aplicar esto:
//
// 1. Paleta. Venía en neutral-*, bg-white / dark:bg-neutral-950, y el haz iba
//    de violeta a azul. Acá el riel es una hairline de papel, el haz va de jade
//    a jade-glow, los títulos van en papel y el fondo es transparente: la
//    sección decide sobre qué se apoya.
// 2. Encabezado. Traía un h2 y un párrafo fijos en inglés ("Changelog from my
//    journey"). Se sacaron: el encabezado lo escribe la sección, con el id que
//    necesita aria-labelledby.
// 3. Medida del riel. Medía la altura con getBoundingClientRect dentro de un
//    efecto y animaba `height`. Acá el riel ocupa todo el alto por CSS y el haz
//    se rellena con `scaleY`, que es transform y no dispara layout. Sin estado
//    ni efecto, y sin salto al hidratar.
// 4. Brillo del haz. Un hilo de 1px de jade sobre noche casi no se ve, así que
//    el haz lleva un halo por box-shadow. El original tenía la franja del riel
//    de 1px y en overflow-hidden, lo que recortaría ese halo: acá riel y haz
//    viven en una franja más ancha centrada en la misma línea.
// 5. Movimiento reducido. `useScroll` no respeta MotionConfig, así que con
//    prefers-reduced-motion el haz queda dibujado completo y quieto.
// 6. Semántica. Los `div` anidados pasan a una lista ordenada (el riel queda
//    afuera del `ol`, que solo admite `li`), y el título deja de ser un h3: la
//    jerarquía de encabezados la lleva el contenido.

export interface TimelineEntry {
  /** Clave estable de la entrada. Si falta se usa el título. */
  id?: string;
  title: string;
  content: ReactNode;
}

/** Un riel de 1px no brilla solo: el halo es lo que hace visible el avance. */
const BEAM_GLOW = "0 0 12px 1px color-mix(in oklab, var(--color-jade-glow) 40%, transparent)";

export const Timeline = ({ data, className }: { data: TimelineEntry[]; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <ol>
        {data.map((item) => (
          <li key={item.id ?? item.title} className="flex justify-start pt-8 md:gap-10 md:pt-14">
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              {/* El disco tapa el riel para que el punto se lea sobre él. */}
              <div
                aria-hidden="true"
                className="bg-night-900 absolute left-3 flex h-10 w-10 items-center justify-center rounded-full"
              >
                <div className="bg-night-700 h-3.5 w-3.5 rounded-full border border-[var(--hairline-strong)]" />
              </div>
              <p className="text-h3 text-paper hidden font-medium text-balance md:block md:pl-20">
                {item.title}
              </p>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <p className="text-h4 text-paper mb-5 font-medium md:hidden">{item.title}</p>
              {item.content}
            </div>
          </li>
        ))}
      </ol>

      {/* Franja centrada en left-8: riel y haz miden 1px, el resto es lugar para el halo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-8 -ml-3.5 w-7 [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
      >
        <div className="absolute inset-0 mx-auto w-px bg-[var(--hairline)]" />
        <motion.div
          style={
            prefersReducedMotion
              ? { scaleY: 1, opacity: 1, boxShadow: BEAM_GLOW }
              : { scaleY: scrollYProgress, opacity, boxShadow: BEAM_GLOW }
          }
          className="from-jade-glow via-jade absolute inset-0 mx-auto w-px origin-top rounded-full bg-linear-to-t from-[0%] via-[12%] to-transparent"
        />
      </div>
    </div>
  );
};
