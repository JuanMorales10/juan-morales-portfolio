"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useRef, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

// Container Scroll Animation: componente de 21st.dev, de Aceternity UI (Manu Arora).
// https://21st.dev/aceternity/container-scroll-animation · https://ui.aceternity.com/components/container-scroll-animation
//
// Una pantalla inclinada en perspectiva que se endereza a medida que se hace
// scroll, con un título que se corre hacia arriba para dejarle lugar. Acá abre
// cada caso de estudio (/proyectos/[slug]): la portada del proyecto es la
// pantalla, y el gesto de enderezarse es lo que la vuelve protagonista.
//
// Qué se cambió del original y por qué. Si algún día se actualiza desde el
// registro, hay que volver a aplicar esto:
//
// 1. Tipos. `Header` recibía `any`; ahora `translate` es `MotionValue<number>`
//    y `titleComponent` un `ReactNode`.
// 2. Paleta. La tableta era `bg-[#222222]` con `border-[#6C6C6C]`, una sombra
//    de seis capas escrita a mano y un interior `bg-gray-100 dark:bg-zinc-900`.
//    Pasa a los tokens del sitio: night-700, hairline-strong, shadow-screen y
//    night-800 adentro.
// 3. Tamaño. La tarjeta tenía alto fijo (30/40rem) y recortaba lo que no
//    entraba. Ahora toma el alto de su contenido, así la portada entra entera
//    con su propia proporción, sea 16:10 o 3:2.
// 4. Recorrido. El contenedor medía 60/80rem solo para darle cuerda al scroll.
//    El progreso ahora va de "start end" a "center center": la pantalla queda
//    derecha cuando llega al centro de la ventana y no hace falta un alto
//    artificial. La escala de móvil ya no achica la tarjeta a 0,7: en un
//    teléfono ese ancho es el único que hay.
// 5. `isMobile` se leía con `setState` dentro de un efecto y un listener de
//    resize. Pasa a `useSyncExternalStore` sobre `matchMedia`: sin efecto, sin
//    listener manual y con snapshot de servidor para hidratar sin saltos.
// 6. Movimiento reducido. Con `prefers-reduced-motion` la rotación, la escala
//    y el desplazamiento quedan fijos: la pantalla se ve derecha desde el
//    principio. Se lee con el mismo `matchMedia` y no con `useReducedMotion`
//    de Motion porque ese hook devuelve `null` en el servidor y el primer
//    render del cliente no coincidiría con el HTML servido.

/** Un media query como store externo: sin efecto, sin estado duplicado. */
function useMediaQuery(query: string, serverSnapshot: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  );
}

export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: ReactNode;
  children: ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const isMobile = useMediaQuery("(max-width: 768px)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", false);

  const rotateRaw = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], isMobile ? [0.94, 1] : [1.04, 1]);
  const translateRaw = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full flex-col items-center justify-center py-6 md:py-10", className)}
    >
      <div className="relative w-full [perspective:1000px]">
        <Header translate={reduced ? 0 : translateRaw} titleComponent={titleComponent} />
        <Card rotate={reduced ? 0 : rotateRaw} scale={reduced ? 1 : scaleRaw}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number> | number;
  titleComponent: ReactNode;
}) => {
  return (
    <motion.div style={{ y: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number> | number;
  scale: MotionValue<number> | number;
  children: ReactNode;
}) => {
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className="shadow-screen bg-night-700 mx-auto mt-10 w-full max-w-[76rem] rounded-[var(--radius-xl)] border border-[var(--hairline-strong)] p-2 md:mt-14 md:p-4"
    >
      <div className="bg-night-800 overflow-hidden rounded-[var(--radius-md)] md:rounded-[var(--radius-lg)]">
        {children}
      </div>
    </motion.div>
  );
};
