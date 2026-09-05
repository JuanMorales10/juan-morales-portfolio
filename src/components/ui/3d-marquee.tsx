"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import type { AnimationPlaybackControls } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

// 3D Marquee: componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://21st.dev/community/components/s/3d-marquee · https://ui.aceternity.com/components/3d-marquee
//
// Una grilla de capturas en perspectiva: cuatro columnas rotadas en 3D que
// suben y bajan a distinto ritmo. Acá es el muro que cierra la sección de
// proyectos de la home: todas las pantallas de todos los proyectos, de un saque.
//
// Qué se cambió del original y por qué:
//
// 1. **Paleta y marco.** `rounded-2xl`, `ring-gray-950/5` y las líneas de la
//    grilla en `#ffffff` con variantes `dark:` pasan a noche y papel. El marco
//    exterior va sin radio porque el muro es a sangre, y sin el `max-sm:h-100`
//    del original: la altura la fija quien lo usa con `className`.
// 2. **Proporción.** `aspect-[970/700]` pasa a 16/10, que es la proporción de
//    casi todas las capturas; en 970/700 se recortaba el pie de cada pantalla.
// 3. **`<img>` a `next/image`.** Son más de treinta PNG de hasta 2880 de
//    ancho: sin el optimizador eran decenas de MB. Se dibujan a un ancho fijo
//    dentro de la grilla escalada, así que `width`, `height` y `sizes` son
//    conocidos y no hace falta el `<img>` crudo.
// 4. **Pausa.** La deriva de cada columna corre con `animate()` sobre un
//    `MotionValue` para poder pausarla al pasar el puntero, y no arranca con
//    `useReducedMotion()`: es un bucle infinito y quien pidió menos movimiento
//    no tiene por qué verlo correr.
// 5. **`alt` vacío.** Las imágenes son decorativas: las mismas capturas están
//    en las tarjetas y en los casos con su `alt` real. El padre las oculta con
//    `aria-hidden`.
//
// Ronda 3, móvil vivo. En escritorio (lg y más) nada de esto cambia:
//
// 6. **Teléfono: muro plano.** Debajo de md la grilla 3D no se monta. A 390 px
//    la caja de 1720 escalada a la mitad dejaba medio contenedor en negro,
//    porque la grilla inclinada no cubre un rectángulo alto y angosto. En su
//    lugar van dos columnas verticales de `Marquee` que derivan en sentidos
//    opuestos, con la misma inclinación de cuatro grados que la escena del
//    hero para que las dos hablen el mismo idioma. Dos y no tres: el sistema
//    no admite más de dos marquesinas corriendo a la vez, y con tres cada
//    pantalla medía cien píxeles y no se reconocía. Las capturas se reparten
//    por alto (una vertical pesa casi tres apaisadas) y cada columna corre a
//    un ritmo proporcional a cuántas lleva. Una vez montado es CSS puro y con
//    movimiento reducido queda quieto solo.
// 7. **Tablet: centrado y escala medidos.** Entre md y lg la grilla se corre
//    para que el centro del paralelogramo que dibuja coincida con el del
//    contenedor, y la escala sale del tamaño real del contenedor (con
//    `ResizeObserver`) en vez de un `scale-75` fijo, que tampoco alcanzaba.
// 8. **`images` lleva ancho y alto.** El muro plano necesita saber cuáles
//    capturas son verticales (pantallas de teléfono) para darles un marco
//    alto en vez de recortarlas a una franja. La grilla 3D sigue usando solo
//    `src`.
// 9. **Rama por ancho con `matchMedia`.** Dos media queries como store
//    externo, con snapshot de servidor igual a la versión de escritorio: el
//    HTML servido es el de siempre y la rama del teléfono entra recién al
//    hidratar, sin desajuste. No hay listener de `resize`.

/** Una captura del muro: la ruta y su tamaño real, para saber si es apaisada. */
export interface WallImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Cada captura ocupa una de cuatro columnas de una grilla de 1720px. En
 * escritorio la grilla va entera (410px por captura); en tablet se escala
 * según el contenedor y puede pasar de 1, por eso pide un poco más.
 */
const SIZES = "(max-width: 767px) 210px, (max-width: 1023px) 480px, 410px";

// Geometría de la grilla 3D, en píxeles antes de escalar. Sirve para centrar
// y escalar en tablet sin tocar lo que se ve en escritorio.
const GRID = 1720;
const GAP = 32;
const COLUMN_W = (GRID - 3 * GAP) / 4;
const ROW_H = (COLUMN_W * 10) / 16;
/** `rotateX(55deg)` sin perspectiva aplasta el eje vertical a este factor. */
const TILT = Math.cos((55 * Math.PI) / 180);
/** `rotateZ(-45deg)`: seno y coseno valen lo mismo. */
const DIAG = Math.SQRT1_2;
/** Corrimiento original de la grilla dentro de la caja: `top-96` y `right-[50%]`. */
const ORIGIN_TOP = 384;
const ORIGIN_LEFT = -GRID / 2;

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

interface Stage {
  width: number;
  height: number;
}

/**
 * Corrimiento y escala para que la grilla inclinada cubra el contenedor.
 *
 * La grilla (1720 de ancho por `rows` filas) rotada 45 grados y aplastada por
 * `rotateX` dibuja un paralelogramo. El componente original la corre 384px
 * hacia abajo y media caja a la izquierda, con lo que el centro de ese
 * paralelogramo no cae en el centro de la caja: en un contenedor ancho no se
 * nota, en uno alto deja vacío el ángulo inferior izquierdo. Acá se proyecta
 * el centro real y se corrige la diferencia.
 *
 * La escala mínima sale de la banda vertical que el paralelogramo cubre a
 * escala 1: la proyección de su lado más corto, que con el contenido de hoy es
 * el ancho fijo de la grilla y con pocas filas sería su alto. Un rectángulo
 * centrado de `w` por `h` entra si `h + TILT * w` no supera esa banda. Se
 * agrega un 5% de margen.
 */
function fitStage(rows: number, stage: Stage | null) {
  const gridH = rows * ROW_H + (rows - 1) * GAP;
  const centerX = DIAG * (GRID / 2 + gridH / 2) + ORIGIN_LEFT;
  const centerY = TILT * DIAG * (gridH / 2 - GRID / 2) + ORIGIN_TOP;
  const dx = GRID / 2 - centerX;
  const dy = GRID / 2 - centerY;

  const band = Math.min(GRID, gridH) * DIAG * 2 * TILT;
  const scale = stage
    ? Math.min(1.3, Math.max(0.6, ((stage.height + TILT * stage.width) / band) * 1.05))
    : null;

  return {
    scale: scale === null ? undefined : scale.toFixed(3),
    top: `${Math.round(ORIGIN_TOP + dy)}px`,
    right: `calc(50% - ${Math.round(dx)}px)`,
  };
}

export function ThreeDMarquee({ images, className }: { images: WallImage[]; className?: string }) {
  const quieto = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const phone = useMediaQuery("(max-width: 767px)", false);
  const desktop = useMediaQuery("(min-width: 1024px)", true);
  const tablet = !phone && !desktop;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);

  // Solo en tablet hace falta medir: en escritorio la escala es fija y en el
  // teléfono la grilla no existe.
  useEffect(() => {
    const element = stageRef.current;
    if (!tablet || !element) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setStage({ width: rect.width, height: rect.height });
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [tablet]);

  if (phone) return <PhoneWall images={images} className={className} />;

  // Cuatro columnas iguales.
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) =>
    images.slice(colIndex * chunkSize, (colIndex + 1) * chunkSize),
  );

  const fit = tablet ? fitStage(chunkSize, stage) : null;

  return (
    <div
      ref={stageRef}
      className={cn("mx-auto block h-[600px] overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex size-full items-center justify-center">
        <div
          className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100"
          style={fit?.scale ? { scale: fit.scale } : undefined}
        >
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              ...(fit ? { top: fit.top, right: fit.right } : {}),
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
          >
            {chunks.map((column, colIndex) => (
              <Column
                key={colIndex}
                images={column}
                index={colIndex}
                paused={paused}
                still={quieto === true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Dos columnas en sentidos opuestos, a un ritmo que depende de cuántas
 * capturas llevan: así la velocidad no cambia si el contenido crece. Unos
 * cuatro segundos por captura son unos 35 píxeles por segundo, y una pantalla
 * tarda más de diez segundos en cruzar el muro: se llega a ver.
 */
const PHONE_COLUMNS = [
  { secondsPerShot: 4, reverse: false },
  { secondsPerShot: 3.2, reverse: true },
];

/**
 * Mínimo de marcos por columna. Siete apaisados a media pantalla son unos 900
 * píxeles: una copia sola ya es más alta que el contenedor (70vh de un
 * teléfono), y con eso a `Marquee` le alcanzan dos copias.
 */
const MIN_PER_COLUMN = 7;

/** Alto de cada marco en anchos de columna: el apaisado va en 16/10, el vertical en 9/16. */
const LANDSCAPE_RATIO = 10 / 16;
const PORTRAIT_RATIO = 16 / 9;

/** Cuánto ocupa una columna en un teléfono: media pantalla, por la escala de 1,15 del conjunto. */
const PHONE_SIZES = "56vw";

const isPortrait = (image: WallImage) => image.height > image.width;

/**
 * Reparte las capturas en columnas de alto parecido: cada una va a la más
 * corta hasta ese momento. Con solo apaisadas equivale a alternar, y como
 * `images` ya viene intercalado por proyecto dos vecinas nunca son del mismo
 * producto; una vertical, que mide casi tres apaisadas, empuja las siguientes
 * a la otra columna en vez de dejar una mucho más larga. Una columna corta se
 * completa repitiendo desde el principio.
 */
function splitBalanced(images: WallImage[]): WallImage[][] {
  const columns = PHONE_COLUMNS.map((): WallImage[] => []);
  const heights = PHONE_COLUMNS.map(() => 0);

  for (const image of images) {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push(image);
    heights[shortest] += isPortrait(image) ? PORTRAIT_RATIO : LANDSCAPE_RATIO;
  }

  return columns.map((column) => {
    if (column.length === 0) return column;
    const filled = [...column];
    while (filled.length < MIN_PER_COLUMN) filled.push(...column);
    return filled;
  });
}

/**
 * El muro plano del teléfono. La deriva la hace `Marquee` en CSS, la
 * inclinación y la escala son estáticas y el desvanecido de arriba y abajo es
 * una máscara sobre el recorte. Todo es `transform`: nada de esto pinta de
 * nuevo mientras corre.
 */
function PhoneWall({ images, className }: { images: WallImage[]; className?: string }) {
  const columns = splitBalanced(images);

  return (
    <div
      className={cn(
        "relative h-[600px] overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]",
        className,
      )}
    >
      {/* Inclinado y un poco más grande que su marco: la escala tapa las
          esquinas que la rotación dejaría libres. Con 1,12 asomaba una a 360
          por 640; 1,15 cubre hasta 430 por 932. */}
      <div className="absolute inset-0 flex -rotate-4 scale-[1.15] gap-3">
        {PHONE_COLUMNS.map((column, columnIndex) => {
          const shots = columns[columnIndex];
          if (shots.length === 0) return null;

          return (
            <Marquee
              key={columnIndex}
              vertical
              reverse={column.reverse}
              duration={`${Math.round(shots.length * column.secondsPerShot)}s`}
              repeat={2}
              gap="0.75rem"
              className="min-w-0 flex-1"
            >
              {shots.map((shot, index) => (
                <div key={`${shot.src}-${index}`} className="screen rounded-[var(--radius-sm)]">
                  <Image
                    src={shot.src}
                    alt=""
                    width={shot.width}
                    height={shot.height}
                    sizes={PHONE_SIZES}
                    className={cn(
                      "w-full object-cover",
                      // Las pantallas de teléfono van altas y muestran su cabecera;
                      // recortadas a 16/10 quedaba una franja irreconocible.
                      isPortrait(shot) ? "aspect-[9/16] object-top" : "aspect-[16/10]",
                    )}
                  />
                </div>
              ))}
            </Marquee>
          );
        })}
      </div>
    </div>
  );
}

function Column({
  images,
  index,
  paused,
  still,
}: {
  images: WallImage[];
  index: number;
  paused: boolean;
  /** Sin movimiento: la columna queda quieta y las capturas no saltan al pasar. */
  still: boolean;
}) {
  const y = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const even = index % 2 === 0;

  useEffect(() => {
    if (still) return;

    const animation = animate(y, [0, even ? 100 : -100], {
      duration: even ? 10 : 15,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });
    controls.current = animation;

    return () => {
      animation.stop();
      controls.current = null;
    };
  }, [y, even, still]);

  // Pausar no reinicia: la columna se queda donde estaba y sigue desde ahí.
  useEffect(() => {
    const animation = controls.current;
    if (!animation) return;
    if (paused) animation.pause();
    else animation.play();
  }, [paused]);

  return (
    <motion.div style={{ y }} className="flex flex-col items-start gap-8">
      <GridLineVertical className="-left-4" offset="80px" />
      {images.map((image, imageIndex) => (
        <div className="relative" key={`${imageIndex}-${image.src}`}>
          <GridLineHorizontal className="-top-4" offset="20px" />
          <motion.div
            whileHover={still ? undefined : { y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={image.src}
              alt=""
              width={970}
              height={606}
              sizes={SIZES}
              className="ring-paper/10 aspect-[16/10] w-full rounded-[var(--radius-sm)] object-cover ring-1"
            />
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/** Variables de las líneas de la grilla: papel al 16 por ciento sobre noche. */
const gridLineVars = (offset: string, thickness: "h" | "v"): CSSProperties =>
  ({
    "--background": "var(--color-night-900)",
    "--color": "color-mix(in oklab, var(--color-paper) 16%, transparent)",
    "--height": thickness === "h" ? "1px" : "5px",
    "--width": thickness === "h" ? "5px" : "1px",
    "--fade-stop": "90%",
    "--offset": offset,
    maskComposite: "exclude",
  }) as CSSProperties;

function GridLineHorizontal({ className, offset }: { className?: string; offset?: string }) {
  return (
    <div
      style={gridLineVars(offset ?? "200px", "h")}
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        className,
      )}
    />
  );
}

function GridLineVertical({ className, offset }: { className?: string; offset?: string }) {
  return (
    <div
      style={gridLineVars(offset ?? "150px", "v")}
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        className,
      )}
    />
  );
}
