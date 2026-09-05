"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { ScrollParallax } from "@/components/primitives/scroll-parallax";
import { SharedElement } from "@/components/primitives/shared-element";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";

// Focus Cards: componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://21st.dev/community/components/s/focus-cards · https://ui.aceternity.com/components/focus-cards
//
// Al pasar el puntero por una tarjeta, esa queda nítida y las demás se
// desenfocan y bajan de opacidad: dirige la mirada a un proyecto por vez. En
// el teléfono, donde no hay puntero, se enciende la que queda en el centro de
// la ventana. Acá es la grilla de proyectos de la home y del índice /proyectos.
//
// Qué se cambió del original y por qué:
//
// 1. **Cada tarjeta es un enlace.** El original era un `div` con la imagen y el
//    título superpuesto al pasar el mouse. Acá es un `<a>` a la página del
//    caso, con la portada arriba y el texto debajo (tipo, nombre y una línea)
//    siempre visible: el nombre no puede depender del hover.
// 2. **`<img>` a `next/image`.** Con `fill` y `sizes` según las columnas; el
//    original bajaba la imagen entera.
// 3. **Paleta y forma.** `bg-gray-100 dark:bg-neutral-900`, `rounded-lg` y el
//    degradado del título pasan al `.screen` del sistema y al `--accent` del
//    proyecto en el borde, al 30 por ciento. Al señalarla, el mismo color
//    hace de halo alrededor de la tarjeta (una sombra difusa sumada a la del
//    `.screen`, que se conserva).
// 4. **Desenfoque solo con puntero y sin movimiento reducido.** El blur y la
//    escala van detrás de `motion-safe:` y `@media (hover: hover)`; en táctil
//    la primera tarjeta tocada quedaba nítida y el resto borroso.
// 5. **Teclado.** El foco enfoca la tarjeta igual que el puntero.
// 6. **Filtro.** Un grupo de botones con `aria-pressed` filtra por `card.kind`.
//    Vive acá porque el estado del hover ya vive acá y el índice lo necesita.
// 7. **Sin `any` ni `React.memo`.** `hovered` cambia en todas las tarjetas a
//    la vez, así que memorizar no ahorraba nada.
// 8. **Elementos compartidos.** Portada y nombre llevan `SharedElement` con los
//    mismos nombres que la página del caso, para que la transición los continúe.
// 9. **Foco por posición en el teléfono (ronda 3).** Debajo de `lg` el único
//    gesto es bajar, así que manda el scroll: un `IntersectionObserver` con
//    `rootMargin` deja una franja del 8% en el centro de la ventana y, de las
//    tarjetas que la tocan, se enciende la más cercana al centro (borde y
//    sombra con `--accent`, "Ver el caso" en jade) y las demás bajan a 0,72.
//    En el hueco entre dos tarjetas se conserva la última: nunca queda todo
//    apagado. Las clases van detrás de `max-lg:` y el observador solo corre
//    debajo de `lg` (`matchMedia` como store externo, con snapshot de
//    servidor), así que el escritorio no cambia. Una tarjeta con foco de
//    teclado nunca se atenúa.
// 10. **La captura flota (ronda 3).** Dentro del marco, `ScrollParallax` corre
//    la imagen 18px por lado mientras cruza la ventana. La imagen sobresale del
//    marco exactamente esos 18px por arriba y por abajo (la variable `--float`,
//    el mismo número que el recorrido), así que en ningún punto del scroll
//    asoma el fondo, mida lo que mida el marco. Un porcentaje no servía: a
//    390px el marco mide unos 220px de alto y el 6% son 13px, menos que el
//    recorrido. En escritorio el recorrido es cero y el marco no cambia.
// 11. **Entrada por tarjeta en el teléfono (ronda 3).** `RevealGroup` dispara
//    todas las tarjetas cuando la lista entra en pantalla, y en una columna las
//    de abajo aparecían fuera de vista: se veían quietas. Ahora cada tarjeta
//    lleva además un `BlurFade` con su propio `inView` y retraso por índice.
//    Las dos entradas viven en el DOM a todo ancho y la CSS elige cuál se ve:
//    `max-lg:` anula con `!important` el estilo en línea del `RevealItem`, y
//    `lg:` el del `BlurFade`. Es la única forma de ganarle a un estilo en línea
//    sin bifurcar el árbol por ancho, que obligaría a remontar las tarjetas
//    (y sus imágenes) al hidratar en el teléfono.

export type FocusCard = {
  /** Identificador estable: el slug del proyecto. */
  id: string;
  title: string;
  /** Rótulo corto debajo de la portada. Es también la clave del filtro. */
  kind: string;
  tagline: string;
  href: string;
  /** Color de la marca del proyecto, en hex. Solo para el borde y el halo. */
  accent: string;
  src: string;
  alt: string;
};

export type FocusFilter = {
  /** Nombre accesible del grupo de botones. */
  label: string;
  /** Rótulo del botón que muestra todo. */
  allLabel: string;
  options: Array<{ value: string; label: string }>;
};

type Columns = 2 | 3;

/**
 * El `.shell` deja de crecer en 1536px, así que arriba de ese ancho el valor
 * se congela: pedir 50vw traería píxeles que nadie ve.
 */
const SIZES: Record<Columns, string> = {
  2: "(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 690px",
  3: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, (max-width: 1535px) 33vw, 450px",
};

/** El mismo corte que `max-lg:` en Tailwind v4. */
const BELOW_LG_QUERY = "(width < 64rem)";

function subscribeBelowLg(onChange: () => void) {
  const media = window.matchMedia(BELOW_LG_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * El servidor no sabe el ancho: se hidrata como escritorio y, si el cliente es
 * más angosto, React vuelve a renderizar enseguida sin desajuste de HTML.
 */
function useBelowLg(): boolean {
  return useSyncExternalStore(
    subscribeBelowLg,
    () => window.matchMedia(BELOW_LG_QUERY).matches,
    () => false,
  );
}

/** Franja activa del foco por posición: el 8% central de la ventana. */
const CENTER_BAND = "-46% 0px -46% 0px";

const NONE: ReadonlySet<string> = new Set();

/**
 * Recorrido de la captura con el scroll, en píxeles por lado. Es también lo
 * que la imagen sobresale del marco (`--float`): si un valor cambia sin el
 * otro, el desplazamiento deja ver el fondo. En escritorio, cero.
 */
const FLOAT_PX = 18;
const FLOAT_RANGE: [number, number] = [-FLOAT_PX, FLOAT_PX];
const STILL_RANGE: [number, number] = [0, 0];

type CenterFocus = "lit" | "dim";

function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

export function Card({
  card,
  index,
  hovered,
  setHovered,
  headingLevel = 3,
  sizes = SIZES[2],
  belowLg = false,
  centerFocus,
}: {
  card: FocusCard;
  index: number;
  hovered: number | null;
  setHovered: Dispatch<SetStateAction<number | null>>;
  /** h3 en la home, h2 en el índice, que tiene su propio h1. */
  headingLevel?: 2 | 3;
  sizes?: string;
  /** Debajo de `lg`: la captura se desplaza con el scroll. */
  belowLg?: boolean;
  /** Foco por posición en el teléfono. Sin valor, ninguna tarjeta está en la franja. */
  centerFocus?: CenterFocus;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const dimmed = hovered !== null && hovered !== index;
  const lit = centerFocus === "lit";
  // Con el teclado sobre la tarjeta (`onFocus` la marca como `hovered`), la
  // posición no la atenúa: quien navega con Tab tiene que ver dónde está.
  const faded = centerFocus === "dim" && hovered !== index;

  return (
    <Link
      href={card.href}
      data-focus-id={card.id}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(index)}
      onBlur={() => setHovered(null)}
      style={{ "--accent": card.accent } as CSSProperties}
      className={cn(
        "group screen flex h-full w-full flex-col border border-[color-mix(in_oklab,var(--accent)_30%,transparent)]",
        "transition-[opacity,filter,transform,border-color,box-shadow] duration-300 ease-out max-lg:duration-400",
        "hover:border-[color-mix(in_oklab,var(--accent)_60%,transparent)] focus-visible:border-[color-mix(in_oklab,var(--accent)_60%,transparent)]",
        "hover:[box-shadow:var(--shadow-screen),0_0_90px_-24px_color-mix(in_oklab,var(--accent)_50%,transparent)]",
        "focus-visible:[box-shadow:var(--shadow-screen),0_0_90px_-24px_color-mix(in_oklab,var(--accent)_50%,transparent)]",
        dimmed &&
          "[@media(hover:hover)]:opacity-55 motion-safe:[@media(hover:hover)]:scale-[0.98] motion-safe:[@media(hover:hover)]:blur-[3px]",
        lit &&
          "max-lg:border-[color-mix(in_oklab,var(--accent)_60%,transparent)] max-lg:[box-shadow:var(--shadow-screen),0_0_90px_-24px_color-mix(in_oklab,var(--accent)_50%,transparent)]",
        /* Se atenúa solo la captura, no la tarjeta entera: con la tarjeta al 72 %
           el rótulo en paper-faint caía a 2,9:1 y dejaba de leerse. */
        faded && "max-lg:[&_[data-shot]]:opacity-60",
      )}
    >
      <SharedElement name={`portada-${card.id}`}>
        <div
          data-shot=""
          style={{ "--float": `${FLOAT_PX}px` } as CSSProperties}
          className="bg-night-800 relative aspect-[16/10] overflow-hidden transition-opacity duration-400 ease-out"
        >
          {/* Debajo de `lg` la captura sobresale `--float` por arriba y por
              abajo y se corre esos mismos píxeles con el scroll: flota sin
              dejar ver el fondo en ningún punto del recorrido. */}
          <ScrollParallax
            range={belowLg ? FLOAT_RANGE : STILL_RANGE}
            className="absolute inset-0 max-lg:-inset-y-(--float)"
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.03]"
            />
          </ScrollParallax>
        </div>
      </SharedElement>

      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <p className="text-paper-faint text-micro font-mono">{card.kind}</p>

        <Heading className="text-h4 text-paper">
          {/* `inline-block`: una caja en línea partida en dos renglones no se
              puede capturar y cancelaría la transición entera. */}
          <SharedElement name={`titulo-${card.id}`}>
            <span className="inline-block">{card.title}</span>
          </SharedElement>
        </Heading>

        <p className="text-paper-muted text-body">{card.tagline}</p>

        <span
          className={cn(
            "text-paper-muted group-hover:text-jade-glow group-focus-visible:text-jade-glow mt-auto inline-flex items-center gap-2 pt-4 text-[0.9375rem] font-medium transition-colors duration-300",
            lit && "max-lg:text-jade-glow",
          )}
        >
          Ver el caso
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function FocusCards({
  cards,
  headingLevel = 3,
  columns = 2,
  filter,
  className,
}: {
  cards: FocusCard[];
  headingLevel?: 2 | 3;
  columns?: Columns;
  /** Con filtro, aparecen los botones y la grilla muestra solo el tipo elegido. */
  filter?: FocusFilter;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  // `null` es "todos": el estado por defecto y el único que no depende del filtro.
  const [active, setActive] = useState<string | null>(null);
  // Tarjetas encendidas por posición. Vacío hasta que alguna cruza la franja.
  const [centered, setCentered] = useState<ReadonlySet<string>>(NONE);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const belowLg = useBelowLg();

  const visible = active === null ? cards : cards.filter((card) => card.kind === active);

  // Al agrandar la ventana hasta escritorio el observador se apaga pero el
  // estado queda: se descarta acá en vez de limpiarlo con otro `setState`.
  const focused = belowLg ? centered : NONE;

  // La clave cambia con el filtro: la grilla se vuelve a montar y las
  // tarjetas entran de nuevo, en vez de reordenarse sin aviso.
  const gridKey = active ?? "todos";

  const choose = (value: string | null) => {
    setActive(value);
    setHovered(null);
    setCentered(NONE);
  };

  useEffect(() => {
    if (!belowLg) return;
    const root = rootRef.current;
    if (!root) return;

    const inBand = new Map<string, HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const id = element.dataset.focusId;
          if (!id) continue;
          if (entry.isIntersecting) inBand.set(id, element);
          else inBand.delete(id);
        }
        // En el hueco entre dos tarjetas ninguna toca la franja: se conserva
        // la última en vez de apagar todo por un instante.
        if (inBand.size === 0) return;

        // Si dos la tocan a la vez (el relevo entre una y la siguiente, o una
        // fila de dos en tablet), gana la más cercana al centro; un empate al
        // píxel es una fila y se encienden las dos.
        const middle = window.innerHeight / 2;
        const distances = Array.from(inBand, ([id, element]) => {
          const rect = element.getBoundingClientRect();
          return [id, Math.abs((rect.top + rect.bottom) / 2 - middle)] as const;
        });
        const best = Math.min(...distances.map(([, distance]) => distance));
        const next = new Set(
          distances.filter(([, distance]) => distance - best <= 1).map(([id]) => id),
        );
        setCentered((previous) => (sameSet(previous, next) ? previous : next));
      },
      { rootMargin: CENTER_BAND },
    );

    root.querySelectorAll<HTMLElement>("[data-focus-id]").forEach((element) => {
      observer.observe(element);
    });
    return () => observer.disconnect();
    // `gridKey`: con el filtro la grilla se remonta y hay tarjetas nuevas que observar.
  }, [belowLg, gridKey]);

  return (
    <div ref={rootRef} className={className}>
      {filter ? (
        <div className="mb-10 flex flex-wrap items-center gap-2" role="group" aria-label={filter.label}>
          <FilterButton pressed={active === null} onClick={() => choose(null)}>
            {filter.allLabel}
          </FilterButton>
          {filter.options.map((option) => (
            <FilterButton
              key={option.value}
              pressed={active === option.value}
              onClick={() => choose(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
          <p className="sr-only" aria-live="polite">
            {`Se muestran ${visible.length} de ${cards.length}`}
          </p>
        </div>
      ) : null}

      <RevealGroup
        key={gridKey}
        as="ul"
        stagger={0.07}
        threshold="loose"
        className={cn(
          "grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6",
          columns === 3 && "xl:grid-cols-3",
        )}
      >
        {visible.map((card, index) => (
          // Dos entradas, una por ancho (punto 11 de arriba): en el teléfono el
          // `RevealItem` queda quieto y visible y entra el `BlurFade`; en
          // escritorio, al revés.
          <RevealItem
            key={card.id}
            as="li"
            className="flex max-lg:opacity-100! max-lg:transform-none!"
          >
            <BlurFade
              inView
              delay={index * 0.08}
              className="flex w-full lg:opacity-100! lg:transform-none! lg:filter-none!"
            >
              <Card
                card={card}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                headingLevel={headingLevel}
                sizes={SIZES[columns]}
                belowLg={belowLg}
                centerFocus={
                  focused.size === 0 ? undefined : focused.has(card.id) ? "lit" : "dim"
                }
              />
            </BlurFade>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function FilterButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "text-micro cursor-pointer rounded-full border px-4 py-2 font-medium transition-colors duration-300",
        pressed
          ? "border-jade bg-jade-ink text-paper"
          : "text-paper-muted hover:border-jade hover:text-paper border-[var(--hairline-strong)]",
      )}
    >
      {children}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}
