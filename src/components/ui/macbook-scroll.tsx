"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

// Macbook Scroll, componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://ui.aceternity.com/components/macbook-scroll
//
// Una notebook dibujada en CSS cuya tapa se abre con el scroll y deja ver una
// captura del producto. Acá es el momento fuerte de "Rienda por dentro": la
// pantalla Vender, la que resume la tesis del producto, se abre sola mientras
// el visitante baja, en lugar de estar pegada como una imagen más.
//
// Qué se cambió del original y por qué. Si algún día se actualiza desde el
// registro, hay que volver a aplicar esto:
//
// 1. **Geometría.** El original gira la pantalla desde su borde superior y la
//    escala a 1,5 hasta despegarla del cuerpo, y el cuerpo es un rectángulo
//    plano visto de frente. Acá la bisagra está abajo, donde va, el teclado
//    queda tumbado en perspectiva (`rotateX`) como se ve una notebook desde
//    adelante, y la tapa nunca se despega. Todas las medidas son porcentajes
//    del ancho, así que la notebook escala entera con `w-[min(...)]` y no hace
//    falta el `scale-[0.35] sm:scale-50 md:scale-100` ni el estado `isMobile`.
// 2. **Escena fija.** El original mide 200vh y mueve la pantalla 1500px hacia
//    abajo para que "acompañe" el scroll. Acá el escenario es `sticky` y mide
//    una pantalla; el contenedor de 175vh define cuánto scroll dura la apertura
//    y el resto del recorrido sostiene la notebook abierta un momento.
// 3. **Teclado.** Venía con quince íconos de `@tabler/icons-react`, un
//    `&mdash;` en la tecla del guion y una tecla por tecla escrita a mano. Acá
//    las filas salen de un arreglo de anchos, las pocas leyendas son texto
//    plano y el paquete de íconos deja de importarse.
// 4. **Paleta.** Grises y negros fijos (`#010101`, `#272729`, `bg-gray-200`)
//    pasan a los tokens de noche: tapa y cuerpo en night-800/700, teclas en
//    night-600, hairlines de papel. El brillo que la pantalla tira sobre el
//    teclado y el halo de fondo toman `--accent`, el color real del proyecto.
// 5. **`<img>` a `next/image`.** Recibe `alt`, `width`, `height` y `sizes`:
//    la captura es de 2880 px y acá se pide a la medida en que se ve.
// 6. **Movimiento reducido.** `useScroll` no respeta `MotionConfig`, y
//    `useReducedMotion()` devuelve `null` en el servidor y un booleano en el
//    cliente, así que decidir el markup con ese hook rompe la hidratación. La
//    versión estática se resuelve con `motion-reduce:` en CSS: la tapa queda
//    abierta y fija, el título visible y el escenario deja de ser `sticky`.
// 7. **Sin `showGradient`.** Era un degradado blanco/negro para fundir el
//    cuerpo con el fondo; sobre noche no hace falta.
// 8. **Teléfono (ronda 3).** Debajo de `md` la notebook no entra y la sección
//    mostraba la captura plana y quieta. Este archivo exporta ahora, además,
//    las piezas cliente de "Rienda por dentro" en el teléfono: `TiltScreen`,
//    la misma pantalla que se endereza, crece y se enciende mientras entra en
//    la ventana (la tapa abriéndose, reducida a una sola pieza); `SnapCarousel`,
//    la tira de áreas con un indicador de posición debajo; y `SnapSlide`, cada
//    tarjeta de la tira, que marca `data-active` cuando es la que está a la
//    vista para que quien la monta encienda su marco y atenúe los vecinos con
//    `group-data-active:` (el foco por posición de SISTEMA, sin puntero). El
//    activo lo decide un `IntersectionObserver` que solo corre debajo de `lg`
//    (`matchMedia` como store externo, con snapshot de servidor): en escritorio
//    no hay puntos ni foco, así que tampoco hay trabajo. El movimiento
//    reducido de `TiltScreen` sigue el criterio del punto 6 (store externo, no
//    `useReducedMotion`) y se aplica al rango de cada `useTransform`, como en
//    `primitives/scroll-parallax`. Viven acá porque este es el único módulo
//    cliente de la sección; si otra sección las necesita, van a `primitives/`.
//    `MacbookScroll` no cambió.

/** Grados de la tapa al empezar: casi cerrada, vista desde arriba. */
const LID_FROM = 75;
/** Fracción del recorrido en la que la tapa termina vertical. */
const LID_DONE = 0.55;

/**
 * Filas del teclado como anchos relativos (`flex-grow`). Es textura, no un
 * teclado usable: las leyendas que quedan son las de las teclas anchas.
 */
const ROWS: number[][] = [
  [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6],
  [1.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.9],
  [2.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.5],
  [1, 1, 1, 1.2, 6, 1.2, 1, 1.4],
];

const LABELS: Record<string, string> = {
  "0-0": "esc",
  "1-13": "delete",
  "2-0": "tab",
  "3-0": "caps",
  "3-12": "return",
  "4-0": "shift",
  "4-11": "shift",
  "5-0": "fn",
  "5-1": "ctrl",
  "5-2": "opt",
  "5-3": "cmd",
  "5-5": "cmd",
};

type AccentStyle = CSSProperties & { "--accent": string };

export function MacbookScroll({
  src,
  alt,
  width,
  height,
  sizes = "(min-width: 1536px) 960px, (min-width: 768px) 80vw, 100vw",
  title,
  badge,
  accent = "var(--color-jade)",
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  /** Frase corta sobre la notebook. Se desvanece cuando la tapa se abre. */
  title?: ReactNode;
  /** Contenido chico abajo a la izquierda del escenario. */
  badge?: ReactNode;
  /** Color del proyecto (hex). Tiñe el halo y la luz que tira la pantalla. */
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const lidRotate = useTransform(scrollYProgress, [0, LID_DONE], [LID_FROM, 0]);
  const glare = useTransform(scrollYProgress, [0, LID_DONE], [1, 0]);
  const deckGlow = useTransform(scrollYProgress, [0.2, LID_DONE], [0, 1]);
  // Ya abierta, la notebook crece apenas: presencia, no zoom.
  const bodyScale = useTransform(scrollYProgress, [0.3, 0.75], [1, 1.05]);
  const floorOpacity = useTransform(scrollYProgress, [0.3, 0.75], [0.35, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const style: AccentStyle = { "--accent": accent };

  return (
    <div ref={ref} style={style} className={cn("relative h-[175vh] motion-reduce:h-auto", className)}>
      <div
        className={cn(
          "sticky top-0 flex h-svh flex-col items-center justify-end overflow-clip pb-[4svh]",
          "motion-reduce:static motion-reduce:h-auto motion-reduce:gap-10 motion-reduce:py-4",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_70%)]"
        />

        {title ? (
          <motion.p
            style={{ y: titleY, opacity: titleOpacity }}
            className={cn(
              "text-h3 text-paper absolute inset-x-0 top-[13svh] mx-auto max-w-[46rem] px-6 text-center",
              "motion-reduce:static motion-reduce:opacity-100! motion-reduce:transform-none!",
            )}
          >
            {title}
          </motion.p>
        ) : null}

        {/* Escena 3D. La cámara queda un poco por encima del centro de la tapa,
            que es desde donde se mira una notebook apoyada en una mesa. */}
        <div className="relative w-[min(60rem,80vw,86svh)] [perspective:2400px] [perspective-origin:50%_35%]">
          <motion.div
            aria-hidden="true"
            style={{ opacity: floorOpacity }}
            className="absolute inset-x-[8%] -bottom-[3%] h-[10%] rounded-full bg-[color:color-mix(in_oklab,var(--accent)_28%,transparent)] blur-2xl motion-reduce:opacity-100!"
          />

          <motion.div
            style={{ scale: bodyScale }}
            className="relative origin-bottom [transform-style:preserve-3d] motion-reduce:transform-none!"
          >
            <Lid rotate={lidRotate} glare={glare}>
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes}
                className="h-full w-full object-cover object-left-top"
              />
            </Lid>
            <Deck glow={deckGlow} />
          </motion.div>
        </div>

        {badge ? (
          <div className="absolute bottom-[4svh] left-[var(--spacing-gutter)]">{badge}</div>
        ) : null}
      </div>
    </div>
  );
}

/** La tapa: bisagra abajo, marco night-800, pantalla 16:10. */
function Lid({
  rotate,
  glare,
  children,
}: {
  rotate: MotionValue<number>;
  glare: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{ rotateX: rotate }}
      className={cn(
        "bg-night-800 relative origin-bottom p-[1.6%] pb-[3.4%] [transform-style:preserve-3d]",
        "[border-radius:2.2%_2.2%_0.8%_0.8%/3.2%_3.2%_1.2%_1.2%]",
        "shadow-[0_0_0_1px_var(--hairline-strong),0_40px_120px_-40px_rgb(0_0_0/0.7)]",
        "motion-reduce:transform-none!",
      )}
    >
      <div className="bg-night-950 aspect-[16/10] overflow-hidden [border-radius:1.2%/1.9%]">
        {children}
      </div>
      {/* Reflejo sobre el vidrio: fuerte con la tapa tumbada, nulo de frente. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: glare }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,color-mix(in_oklab,var(--color-paper)_14%,transparent),transparent_45%)] motion-reduce:opacity-0!"
      />
    </motion.div>
  );
}

/**
 * El cuerpo, tumbado 66 grados desde la bisagra. El envoltorio reserva solo
 * la altura proyectada (24% del ancho) para que la caja de layout no mida lo
 * que mediría el teclado visto de frente.
 */
function Deck({ glow }: { glow: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="relative aspect-[100/24]">
      <div
        className={cn(
          "bg-night-700 absolute inset-x-0 top-0 aspect-[100/58] origin-top overflow-hidden [transform:rotateX(66deg)]",
          "[border-radius:0_0_3%_3%/0_0_4.5%_4.5%]",
          "shadow-[0_0_0_1px_var(--hairline-strong),inset_0_1px_0_var(--hairline)]",
        )}
      >
        {/* Luz de la pantalla sobre el teclado, del color del producto. */}
        <motion.div
          style={{ opacity: glow }}
          className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_55%)] motion-reduce:opacity-100!"
        />
        <div className="bg-night-950 absolute inset-x-[10%] top-0 h-[2.6%] [border-radius:0_0_40%_40%/0_0_100%_100%]" />

        <SpeakerGrid className="left-[2%]" />
        <SpeakerGrid className="right-[2%]" />

        <div className="bg-night-800 absolute inset-x-[12.5%] top-[6%] flex h-[56%] flex-col gap-[0.55%] p-[0.8%] [border-radius:1.2%/1.6%]">
          {ROWS.map((row, r) => (
            <div key={r} className="flex flex-1 gap-[0.55%]">
              {row.map((grow, k) => (
                <span
                  key={k}
                  style={{ flexGrow: grow }}
                  className="bg-night-600 text-paper-faint flex min-w-0 flex-1 basis-0 items-end rounded-[12%] px-[3px] pb-[2px] font-mono text-[5px] leading-none shadow-[inset_0_-1px_0_rgb(0_0_0/0.5)]"
                >
                  {LABELS[`${r}-${k}`]}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute inset-x-[31%] top-[66%] bottom-[5%] [border-radius:2%/3%] shadow-[inset_0_0_0_1px_var(--hairline)]" />
      </div>
    </div>
  );
}

function SpeakerGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute top-[6%] bottom-[36%] w-[9%] opacity-80",
        "bg-[radial-gradient(circle,var(--color-night-950)_0.6px,transparent_0.7px)] bg-[size:3px_3px]",
        className,
      )}
    />
  );
}

/* ---------------------------------------------------------------------------
   Teléfono (ronda 3). Ver el punto 8 del comentario de cabecera.
   ------------------------------------------------------------------------- */

/** Un media query como store externo: sin efecto ni estado duplicado. */
function mediaStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    read: () => window.matchMedia(query).matches,
  };
}

const reducedMotion = mediaStore("(prefers-reduced-motion: reduce)");
/** El mismo corte que `max-lg:` en Tailwind v4. */
const belowLg = mediaStore("(width < 64rem)");

/**
 * `prefers-reduced-motion` como store externo. `useReducedMotion` de Motion
 * devuelve `null` en el servidor y el valor real en el primer render del
 * cliente, así que el estilo servido no coincidiría con el hidratado (punto 6).
 * El snapshot de servidor es "quieto": sin JavaScript y antes de hidratar la
 * pantalla se ve derecha y entera, y la inclinación aparece recién cuando se
 * sabe que nadie la rechazó. La sección queda muy abajo del pliegue, así que
 * ese cambio no se ve.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(reducedMotion.subscribe, reducedMotion.read, () => true);
}

/**
 * El servidor no sabe el ancho: se hidrata como escritorio y, si el cliente es
 * más angosto, React vuelve a renderizar enseguida sin desajuste de HTML.
 */
function useBelowLg(): boolean {
  return useSyncExternalStore(belowLg.subscribe, belowLg.read, () => false);
}

/** Grados de la pantalla del teléfono al entrar: tumbada hacia atrás. */
const TILT_FROM = 22;

/**
 * La captura sola, para pantallas donde la notebook no entra. Mientras el
 * bloque sube desde el borde inferior hasta el centro de la ventana, la
 * pantalla se endereza desde `TILT_FROM` grados (bisagra abajo, como la tapa),
 * crece de 0,9 a 1 y pasa de 0,55 a opacidad plena; detrás, un halo del color
 * del proyecto se enciende con ella. Solo `transform` y `opacity`.
 *
 * Con movimiento reducido el rango de cada valor se aplana en su estado final
 * (los `MotionValue` siguen siendo los mismos, solo dejan de variar) y la
 * pantalla se ve derecha y encendida desde el principio.
 */
export function TiltScreen({
  src,
  alt,
  width,
  height,
  // Por defecto, el ancho útil de un `.shell` en un teléfono.
  sizes = "92vw",
  accent = "var(--color-jade)",
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  /** Color del proyecto (hex). Tiñe el halo y el borde del marco. */
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // Quieto: cada rango se aplana en su valor final. `useTransform` recalcula en
  // el mismo render cuando cambia el rango, así el primer render del cliente
  // calca al servidor y la inclinación aparece recién después de hidratar.
  const rotateX = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [TILT_FROM, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [0.55, 1]);
  const haloOpacity = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [0.2, 1]);

  const style: AccentStyle = { "--accent": accent };

  return (
    <div ref={ref} style={style} className={cn("relative [perspective:1200px]", className)}>
      {/* El halo sangra hasta los bordes de la ventana: el padre vive en un `.shell`. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: haloOpacity }}
        className="pointer-events-none absolute -inset-x-[var(--spacing-gutter)] -inset-y-12 bg-[radial-gradient(70%_65%_at_50%_45%,color-mix(in_oklab,var(--accent)_34%,transparent),transparent_72%)]"
      />
      <motion.div
        style={{ rotateX, scale, opacity }}
        className="screen relative origin-bottom border border-[color:color-mix(in_oklab,var(--accent)_30%,transparent)]"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className="h-auto w-full" />
      </motion.div>
    </div>
  );
}

export type SnapItem = {
  /** Identificador estable de la tarjeta. */
  id: string;
  /** Nombre corto: es lo que anuncia el botón del punto. */
  label: string;
};

/** Fracción de una tarjeta que tiene que verse dentro de la tira para ser la activa. */
const SNAP_RATIO = 0.6;

const SLIDE_SELECTOR = "[data-snap-index]";

/** Índice de la tarjeta a la vista; cada `SnapSlide` lo compara con el suyo. */
const SnapContext = createContext(0);

/**
 * Una tira con scroll horizontal y snap (el CSS lo pone quien la monta) más un
 * indicador de posición: un punto por tarjeta, encendido el de la que ocupa la
 * ventana de la tira. El activo lo decide un `IntersectionObserver` con la
 * tira como raíz, así que no depende de la posición vertical de la página, y
 * solo corre debajo de `lg`: arriba no hay puntos ni foco que mover. Cada
 * punto es un botón que lleva a su tarjeta con `scrollIntoView`.
 *
 * Las tarjetas son `SnapSlide`, en el mismo orden que `items`. Lo que va
 * dentro de cada una sigue siendo de quien monta la tira (puede venir del
 * servidor con `next/image`); acá solo se observa y se reparte el activo.
 */
export function SnapCarousel({
  label,
  items,
  children,
  className,
  indicatorClassName,
  style,
}: {
  /** Nombre accesible de la región que hace scroll. */
  label: string;
  /** Una entrada por tarjeta, en el orden del DOM. */
  items: SnapItem[];
  children: ReactNode;
  /** Clases del contenedor con scroll: ahí va el snap, el padding y el overflow. */
  className?: string;
  /** Clases del bloque de puntos: quien monta la tira decide en qué anchos se ven. */
  indicatorClassName?: string;
  style?: CSSProperties;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const narrow = useBelowLg();

  useEffect(() => {
    if (!narrow) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = scroller.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
    if (slides.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // La primera notificación llega para todas las tarjetas, también la
          // vecina que asoma un 10 por ciento: hay que mirar la fracción, no
          // solo `isIntersecting`.
          if (entry.intersectionRatio < SNAP_RATIO - 0.01) continue;
          const index = Number((entry.target as HTMLElement).dataset.snapIndex);
          if (Number.isInteger(index)) setActive(index);
        }
      },
      { root: scroller, threshold: SNAP_RATIO },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [narrow]);

  const goTo = (index: number) => {
    const slide = scrollerRef.current?.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)[index];
    if (!slide) return;
    // `block: "nearest"` para que la página no se mueva en vertical; el
    // `scroll-padding` de la tira alinea igual que el snap.
    slide.scrollIntoView({
      behavior: reducedMotion.read() ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <>
      <div ref={scrollerRef} role="region" aria-label={label} tabIndex={0} style={style} className={className}>
        <SnapContext value={active}>{children}</SnapContext>
      </div>

      {items.length > 1 ? (
        <div className={indicatorClassName}>
          {/* El margen negativo deja el primer punto al ras del gutter. */}
          <div className="-ml-3 flex">
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ir a ${item.label}`}
                  aria-current={isActive ? true : undefined}
                  onClick={() => goTo(index)}
                  className="flex h-10 w-8 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      // En Tailwind v4 `scale-*` escribe la propiedad `scale`, no `transform`.
                      "block h-1.5 w-1.5 rounded-full transition-[scale,opacity] duration-300 ease-[var(--ease-out-quint)]",
                      isActive ? "bg-jade scale-150" : "bg-paper opacity-30",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * Una tarjeta de la tira. Lleva `group` y marca `data-active` cuando es la que
 * está a la vista, así quien la monta enciende o atenúa lo que quiera con
 * `group-data-active:` (debajo de `lg`, para no tocar el escritorio). El
 * servidor la renderiza con la primera activa, que es lo que se ve sin JS.
 */
export function SnapSlide({
  index,
  className,
  children,
}: {
  /** Posición en la tira, la misma que en `items`. */
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const active = useContext(SnapContext) === index;

  return (
    <li
      data-snap-index={index}
      data-active={active ? "" : undefined}
      className={cn("group", className)}
    >
      {children}
    </li>
  );
}
