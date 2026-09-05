"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useSyncExternalStore } from "react";

import { Lens } from "@/components/ui/lens";
import type { Shot } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Galería del caso.
 *
 * Las piezas tienen proporciones distintas (pantallas apaisadas, un teléfono
 * vertical, alguna imagen chica) y ninguna se recorta. La grilla es una fila
 * flexible que se llena por proporción: cada ítem pide un ancho igual a su
 * proporción por una altura de fila común y crece en la misma medida, así todo
 * lo que comparte fila termina con la misma altura, tenga la forma que tenga.
 * La caja de cada captura lleva el `aspect-ratio` del propio archivo.
 *
 * Un ítem que queda solo en su fila no se estira hasta el borde: tiene un techo
 * de altura, y las imágenes chicas no se agrandan por encima de su tamaño real.
 * En el teléfono la fila se apila y los verticales se acotan a dos tercios del
 * ancho para no ocupar una pantalla entera.
 *
 * Cada captura va dentro de `Lens` (Aceternity, 21st.dev), que amplía la zona
 * bajo el puntero: en una captura de producto es la diferencia entre ver que
 * hay una tabla y poder leerla. Con `prefers-reduced-motion` la lupa no se
 * monta y queda la imagen quieta.
 */

/** Altura objetivo de cada fila. Los ítems crecen desde acá para llenar. */
const ROW_HEIGHT = "clamp(13rem, 24vw, 24rem)";

/** Techo de altura de un ítem, en filas. Frena al que quedó solo en la suya. */
const MAX_ROWS = 1.9;

type StripStyle = CSSProperties & Record<`--${string}`, string | number>;

/** `prefers-reduced-motion` como store externo, con snapshot de servidor. */
function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // Sin JavaScript y en el primer render queda la versión quieta: es la
    // segura, y la lupa aparece recién cuando se sabe que nadie la rechazó.
    () => true,
  );
}

export function CaseGallery({ shots }: { shots: Shot[] }) {
  const reduced = usePrefersReducedMotion();

  const listStyle: StripStyle = { "--row-h": ROW_HEIGHT };

  return (
    <ul
      className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-6 sm:gap-y-12"
      style={listStyle}
    >
      {shots.map((shot) => {
        const ratio = shot.width / shot.height;
        const portrait = ratio < 1;

        const itemStyle: StripStyle = {
          "--ratio": ratio,
          // Ancho máximo: ni más alto que el techo de filas ni más grande que
          // el archivo, que en pantallas de alta densidad ya se ve al límite.
          "--cap": `min(${shot.width}px, calc(${ratio} * var(--row-h) * ${MAX_ROWS}))`,
        };

        return (
          <li
            key={shot.src}
            style={itemStyle}
            className={cn(
              "w-full",
              portrait && "max-w-[68%]",
              "sm:w-auto sm:min-w-0 sm:max-w-[var(--cap)] sm:[flex-basis:calc(var(--ratio)*var(--row-h))] sm:[flex-grow:var(--ratio)]",
            )}
          >
            <figure>
              <div className="screen">
                {reduced ? (
                  <Frame shot={shot} />
                ) : (
                  <Lens zoomFactor={1.8} lensSize={220}>
                    <Frame shot={shot} />
                  </Lens>
                )}
              </div>
              {shot.caption ? (
                <figcaption className="text-micro text-paper-muted mt-4">{shot.caption}</figcaption>
              ) : null}
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Caja con la proporción exacta del archivo. `Lens` renderiza a sus hijos dos
 * veces (la imagen y la copia ampliada), así que la caja tiene que saber su
 * tamaño sola, sin depender del contenedor.
 */
function Frame({ shot }: { shot: Shot }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        // Techo real de un ítem en escritorio: 1,9 filas de 24rem por 1,9 de
        // proporción ronda los 1100 px. Más ancho que eso no se pide nunca.
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 1100px"
        className="object-cover"
      />
    </div>
  );
}
