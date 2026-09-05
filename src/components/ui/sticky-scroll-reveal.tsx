"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import type { ReactNode } from "react";
import { useRef, useState, useSyncExternalStore } from "react";

import { BlurFade } from "@/components/ui/blur-fade";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Sticky Scroll Reveal: componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://21st.dev/aceternity · https://ui.aceternity.com/components/sticky-scroll-reveal
//
// Una columna de pasos que se leen bajando y, al costado, un panel que se queda
// quieto y cambia de contenido según el paso que está a la altura de la vista.
// Acá se usa en "Cómo trabajo" (sections/how-i-work.tsx): cada paso del proceso
// trae en el panel una captura real de un proyecto distinto, que es la prueba de
// que el paso existe y no un ícono que lo ilustra.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. Scroll de la página, no de una caja. El original mete todo en un div de
//    30rem con `overflow-y-auto` y escucha ese contenedor: una trampa de scroll
//    dentro de la página, con la rueda del mouse capturada a mitad de lectura.
//    Acá `useScroll` apunta al bloque entero (`target`) y el panel es
//    `position: sticky`, así que se recorre con el scroll normal.
// 2. Paleta. Fuera los fondos slate/black/neutral que el original animaba y los
//    degradados cian-esmeralda, rosa-índigo y naranja-amarillo del panel. El
//    panel no tiene fondo propio: cada captura llega con su marco `.screen`
//    (night-800) y el halo del acento de su proyecto, armados por quien llama.
// 3. El paso activo se deduce del progreso con `floor`, porque los pasos miden
//    lo mismo desde `lg`. Se fue el `useEffect` que copiaba el degradado a un
//    estado (setState dentro de un efecto) y los `any` del tipo y del ref.
// 4. Texto legible sin JavaScript: el original arrancaba en `opacity: 0`. Acá
//    el atenuado de los pasos que no están activos es una transición de CSS que
//    solo corre desde `lg` y con movimiento permitido; en el servidor y abajo
//    de eso todo se lee entero.
// 5. Movimiento reducido y pantallas chicas: lista simple con la captura debajo
//    de cada paso. Esa decisión es de CSS (`motion-safe:`, `motion-reduce:` y
//    `lg:`), no de JavaScript: `useReducedMotion()` devuelve `null` en el
//    servidor y un booleano en el cliente, y decidir el markup con ese valor
//    rompe la hidratación para quien pidió menos movimiento. El hook queda solo
//    para no seguir actualizando estado con el scroll cuando el panel está
//    oculto (`useScroll` no respeta el `MotionConfig` por sí solo).
// 6. El panel apila los contenidos en una misma celda de grilla y cruza el
//    activo con opacidad y una escala mínima, en vez de montar y desmontar el
//    nodo: las capturas quedan cargadas y el alto del panel no salta.
// 7. Ronda 3, móvil vivo. Debajo de `lg` la lista dejó de estar quieta: el
//    título y el texto de cada paso entran con `BlurFade` al aparecer, y cada
//    ítem puede traer un `listContent` distinto del `content` del panel, para
//    que quien llama arme una captura que flota con el scroll sin tocar la del
//    panel fijo. La rama por ancho es de JavaScript y no de CSS porque la lista
//    es también la columna de texto del escritorio: duplicar los encabezados
//    para esconder una copia no vale la pena. Se lee con `matchMedia` vía
//    `useSyncExternalStore`, que en el servidor y durante la hidratación
//    devuelve "escritorio" y recién después cambia: sin desajustes de
//    hidratación y sin `setState` dentro de un efecto. Las dos cosas (las
//    entradas y `listContent`) dependen solo de esa rama, no de la preferencia
//    de movimiento: en escritorio, con o sin movimiento reducido, la lista
//    sigue mostrando `content` como antes y nada cambia.

export type StickyScrollItem = {
  /** Clave estable. Si falta se usa el título. */
  id?: string;
  title: string;
  description: string;
  /** Lo que se ve en el panel fijo mientras este paso está activo. */
  content?: ReactNode;
  /**
   * Lo que se ve debajo del paso en pantallas chicas (debajo de `lg`), donde
   * no hay panel. Si falta se usa `content`. En escritorio con movimiento
   * reducido la lista sigue mostrando `content`: así 1440 no cambia.
   */
  listContent?: ReactNode;
};

const panelTransition = { duration: 0.45, ease: easeOutExpo } as const;

/** El mismo corte que `max-lg:` de Tailwind. */
const BELOW_LG = "(width < 64rem)";

function subscribeBelowLg(onChange: () => void) {
  const query = window.matchMedia(BELOW_LG);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const getBelowLg = () => window.matchMedia(BELOW_LG).matches;
const getBelowLgOnServer = () => false;

/** `true` debajo de `lg`. En el servidor siempre `false`, igual que el primer render. */
function useBelowLg() {
  return useSyncExternalStore(subscribeBelowLg, getBelowLg, getBelowLgOnServer);
}

export function StickyScroll({
  content,
  contentClassName,
  className,
}: {
  content: StickyScrollItem[];
  /** Clases del panel fijo (la caja que queda pegada, no cada contenido). */
  contentClassName?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const compact = useBelowLg();
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  // De 0 cuando el bloque llega al centro de la ventana a 1 cuando lo deja. Con
  // pasos de igual altura, el paso que está en el centro es `floor(p * n)`.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Con movimiento reducido o debajo de `lg` el panel está oculto por CSS:
    // nada que actualizar.
    if (reduceMotion || compact) return;
    const next = Math.min(content.length - 1, Math.max(0, Math.floor(latest * content.length)));
    setActive(next);
  });

  return (
    <div ref={ref} className={cn("grid12 gap-y-4", className)}>
      <ol className="col-span-12 list-none motion-safe:lg:col-span-4">
        {content.map((item, index) => {
          const isActive = index === active;
          // `listContent` solo debajo de `lg`; el servidor y el escritorio
          // reciben `content`, el mismo nodo de siempre.
          const inline = compact ? (item.listContent ?? item.content) : item.content;

          const title = <h3 className="text-h3">{item.title}</h3>;
          const description = (
            <p className="text-body text-paper-muted measure mt-4">{item.description}</p>
          );

          return (
            <li
              key={item.id ?? item.title}
              className={cn(
                "border-t py-10 first:border-t-0 first:pt-0",
                // Con movimiento: cada paso ocupa casi una ventana, para que el
                // scroll tenga recorrido mientras el panel cambia.
                "motion-safe:lg:flex motion-safe:lg:min-h-[85svh] motion-safe:lg:items-center motion-safe:lg:border-t-0 motion-safe:lg:py-0",
                // Sin movimiento: texto y captura lado a lado, sin panel.
                "motion-reduce:lg:grid motion-reduce:lg:grid-cols-12 motion-reduce:lg:items-center motion-reduce:lg:gap-x-8",
              )}
            >
              <div
                data-active={isActive ? "" : undefined}
                className="ease-out-expo transition-opacity duration-500 motion-safe:lg:opacity-45 motion-safe:lg:data-active:opacity-100 motion-reduce:lg:col-span-4"
              >
                {compact ? (
                  <>
                    <BlurFade inView>{title}</BlurFade>
                    <BlurFade inView delay={0.08}>
                      {description}
                    </BlurFade>
                  </>
                ) : (
                  <>
                    {title}
                    {description}
                  </>
                )}
              </div>

              {inline ? (
                <div className="mt-8 motion-safe:lg:hidden motion-reduce:lg:col-span-7 motion-reduce:lg:col-start-6 motion-reduce:lg:mt-0">
                  {inline}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="hidden motion-safe:lg:col-span-7 motion-safe:lg:col-start-6 motion-safe:lg:block">
        <div className={cn("sticky top-0 flex h-svh items-center py-24", contentClassName)}>
          <div className="grid w-full">
            {content.map((item, index) => {
              const isActive = index === active;

              return (
                <motion.div
                  key={item.id ?? item.title}
                  className="col-start-1 row-start-1"
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.96,
                    y: isActive ? 0 : 18,
                  }}
                  transition={panelTransition}
                  style={{ pointerEvents: isActive ? "auto" : "none", zIndex: isActive ? 1 : 0 }}
                  aria-hidden={!isActive}
                >
                  {item.content}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
