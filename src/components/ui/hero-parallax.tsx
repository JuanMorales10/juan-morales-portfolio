"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useRef, useSyncExternalStore } from "react";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

// Hero Parallax, componente de 21st.dev, de Manu Arora (Aceternity UI).
// https://ui.aceternity.com/components/hero-parallax
//
// Tres filas de capturas que, al hacer scroll, se enderezan desde una
// inclinación en 3D y se deslizan en sentidos opuestos. Acá es la portada del
// portfolio: quince pantallas reales de los cinco proyectos debajo del titular.
// Se usa en `sections/hero.tsx`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **El encabezado entra por prop.** El original trae un `Header` con texto
//    fijo. Acá `HeroParallax` recibe `header` y el `Header` exportado es solo
//    el marco de la grilla; el copy sale de `content/profile`.
// 2. **Paleta y marco.** Venía con `bg-black`, `text-white` y un velo negro al
//    pasar el puntero. Cada tarjeta va ahora dentro de un `.screen` del sistema
//    y lleva un halo con el color de marca de su proyecto (`--accent`).
// 3. **`<img>` a `next/image`.** Las capturas son PNG de hasta 2880 px; quince
//    juntas sin optimizar son decenas de MB. Se conocen ancho y alto, así que
//    van con `fill` y `sizes` reales.
// 4. **Enlaces, pero fuera del orden de tabulación.** Cada tarjeta es un
//    `Link` a su caso para quien navega con puntero, con el nombre del proyecto
//    visible al pasar por encima. La escena es una copia decorativa de la
//    sección Proyectos, así que va `aria-hidden` y los enlaces con
//    `tabIndex={-1}`: sin eso, un teclado tendría que pasar por quince tarjetas
//    antes de llegar al resto de la página, y cada caso ya tiene su enlace con
//    nombre en Proyectos. La imagen queda con `alt=""`.
// 5. **Alto automático.** El `h-[300vh]` fijo dejaba un vacío enorme en
//    pantallas altas. El contenedor mide lo que mide y el relleno inferior
//    absorbe el desplazamiento final de la escena.
// 6. **Recorrido acotado.** El desplazamiento vertical iba de -700 a 500 y
//    tapaba el titular. Acá la escena arranca justo debajo del texto y se
//    queda casi quieta mientras se endereza, con la inclinación hacia el lado
//    donde no hay texto.
// 7. **Movimiento reducido.** Con `prefers-reduced-motion` la escena se
//    reemplaza por una grilla quieta con las mismas capturas: tres columnas en
//    escritorio, dos por dos en el teléfono. Se lee con `useSyncExternalStore`
//    para que el HTML del servidor y el del cliente coincidan.
// 8. **Marquesinas verticales en el teléfono (ronda 3).** Debajo de `md` la
//    escena era una grilla quieta de seis miniaturas. Ahora son dos columnas
//    del `Marquee` de Magic UI que derivan solas en sentidos opuestos, con las
//    puntas desvanecidas por `mask-image` y una leve inclinación de conjunto.
//    Cada tarjeta es el mismo marco con halo y enlace de escritorio, con el
//    nombre en mono siempre visible porque no hay puntero que lo revele. La
//    rama de escritorio no cambia: solo se movió el `Link` a `ScreenLink` para
//    que las dos escenas lo compartan.

export type ParallaxProduct = {
  /** Nombre del proyecto. Se ve al pasar el puntero; en móvil, siempre. */
  title: string;
  link: string;
  thumbnail: string;
  width: number;
  height: number;
  /** Color de marca del proyecto, en hex. Solo para el halo de su tarjeta. */
  accent: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * `useReducedMotion` de Motion ya conoce la preferencia en el primer render
 * del cliente, y el servidor no: si la grilla cambia de forma según ese valor,
 * el HTML no coincide. Con un store externo React renderiza primero lo mismo
 * que el servidor y recién después la versión quieta.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export const HeroParallax = ({
  products,
  header,
  className,
}: {
  products: ParallaxProduct[];
  /** Rótulo, titular, bajada y botones. Va dentro de `Header`. */
  header: ReactNode;
  className?: string;
}) => {
  const perRow = Math.max(1, Math.ceil(products.length / 3));
  const firstRow = products.slice(0, perRow);
  const secondRow = products.slice(perRow, perRow * 2);
  const thirdRow = products.slice(perRow * 2, perRow * 3);
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.18, 1]), springConfig);
  // Negativo a propósito: levanta el lado derecho, donde el titular no llega.
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [-20, 0]), springConfig);
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-140, 380]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col overflow-hidden pb-10 [perspective:1000px] [transform-style:preserve-3d] md:pb-[26rem]",
        still && "md:pb-24",
        className,
      )}
    >
      {header}

      {still ? (
        <ul aria-hidden="true" className="shell mt-10 hidden grid-cols-3 gap-6 md:grid">
          {products.map((product) => (
            <ProductCard
              key={product.thumbnail}
              product={product}
              className="w-full"
              sizes="(max-width: 1536px) 33vw, 500px"
            />
          ))}
        </ul>
      ) : (
        <motion.div
          aria-hidden="true"
          style={{ rotateX, rotateZ, translateY, opacity }}
          className="relative z-0 mt-8 hidden md:mt-10 md:block"
        >
          <ul className="mb-16 flex flex-row-reverse gap-16">
            {firstRow.map((product) => (
              <ProductCard key={product.thumbnail} product={product} translate={translateX} />
            ))}
          </ul>
          <ul className="mb-16 flex flex-row gap-16">
            {secondRow.map((product) => (
              <ProductCard
                key={product.thumbnail}
                product={product}
                translate={translateXReverse}
              />
            ))}
          </ul>
          <ul className="flex flex-row-reverse gap-16">
            {thirdRow.map((product) => (
              <ProductCard key={product.thumbnail} product={product} translate={translateX} />
            ))}
          </ul>
        </motion.div>
      )}

      {/* Pantallas chicas: con movimiento reducido, cuatro capturas quietas con
          el nombre visible; si no, las dos columnas que derivan. */}
      {still ? (
        <ul aria-hidden="true" className="shell mt-10 grid grid-cols-2 gap-3 md:hidden">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.thumbnail}
              product={product}
              className="w-full"
              sizes="44vw"
              labelAlways
            />
          ))}
        </ul>
      ) : (
        <DriftingColumns products={products} />
      )}
    </div>
  );
};

/** Marco del encabezado: ancho del sitio, por encima de la escena. */
export const Header = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn("shell relative z-10 w-full", className)}>{children}</div>;
};

export const ProductCard = ({
  product,
  translate,
  className,
  sizes = "480px",
  labelAlways = false,
}: {
  product: ParallaxProduct;
  /** Desplazamiento horizontal ligado al scroll. Sin él, la tarjeta no se mueve. */
  translate?: MotionValue<number>;
  className?: string;
  sizes?: string;
  /** Muestra el nombre siempre, no solo al pasar el puntero. */
  labelAlways?: boolean;
}) => {
  return (
    <motion.li
      style={translate ? { x: translate } : undefined}
      whileHover={{ y: -16 }}
      className={cn("group/product relative w-[30rem] shrink-0", className)}
    >
      <ScreenLink product={product} sizes={sizes} label={labelAlways ? "always" : "hover"} />
    </motion.li>
  );
};

/**
 * El enlace que comparten las dos escenas: marco `.screen`, halo con el color
 * de marca del proyecto y el nombre encima. `label` decide cómo aparece el
 * nombre: al pasar el puntero (escritorio), siempre, o siempre y en mono chico
 * para la marquesina del teléfono, donde la tarjeta es pequeña y se mueve
 * sola, así que el rótulo va sin `backdrop-blur` (caro sobre un fondo que
 * cambia cada cuadro).
 */
const ScreenLink = ({
  product,
  sizes,
  label,
}: {
  product: ParallaxProduct;
  sizes: string;
  label: "hover" | "always" | "mono";
}) => {
  return (
    /* `z-0` abre un contexto de apilamiento: sin él, el halo con `-z-10`
       se iría detrás del fondo de la sección y no se vería. */
    <Link
      href={product.link}
      tabIndex={-1}
      className="relative z-0 block rounded-[var(--radius-md)]"
      style={{ "--accent": product.accent } as CSSProperties}
    >
      {/* Halo con el color de marca del proyecto, detrás de la pantalla. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 -z-10 opacity-70 transition-opacity duration-500 group-hover/product:opacity-100"
        style={{
          background:
            "radial-gradient(62% 62% at 50% 55%, color-mix(in oklab, var(--accent) 36%, transparent), transparent 72%)",
        }}
      />
      <span className="screen relative block aspect-[16/10] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)]">
        <Image
          src={product.thumbnail}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-top"
        />
      </span>
      {label === "mono" ? (
        <span className="bg-night-900/90 text-paper absolute bottom-2 left-2 rounded-full px-2.5 py-1.5 font-mono text-[0.6875rem] leading-none tracking-[0.02em]">
          {product.title}
        </span>
      ) : (
        <span
          className={cn(
            "bg-night-900/85 text-paper absolute bottom-3 left-3 rounded-full px-3 py-1 text-[0.8125rem] leading-snug font-medium backdrop-blur-sm transition-opacity duration-300",
            label === "always" ? "opacity-100" : "opacity-0 group-hover/product:opacity-100",
          )}
        >
          {product.title}
        </span>
      )}
    </Link>
  );
};

/** Mínimo de tarjetas por columna: con menos, la vuelta se nota. */
const MIN_PER_COLUMN = 4;

/**
 * Reparte las capturas alternadas en dos columnas. `products` ya viene
 * intercalado por proyecto, así que dos vecinas nunca son del mismo producto y
 * los colores de marca se mezclan. Una columna corta se completa repitiendo
 * desde el principio.
 */
function splitInColumns(products: ParallaxProduct[]): [ParallaxProduct[], ParallaxProduct[]] {
  const even = products.filter((_, index) => index % 2 === 0);
  const odd = products.filter((_, index) => index % 2 === 1);
  return [fillColumn(even), fillColumn(odd.length > 0 ? odd : even)];
}

function fillColumn(column: ParallaxProduct[]): ParallaxProduct[] {
  if (column.length === 0) return column;
  return Array.from(
    { length: Math.max(MIN_PER_COLUMN, column.length) },
    (_, index) => column[index % column.length],
  );
}

/**
 * Escena del teléfono: dos columnas de capturas que derivan solas, una hacia
 * arriba y otra hacia abajo, con las puntas desvanecidas y el conjunto apenas
 * inclinado. En una pantalla táctil no hay puntero que enderece nada, así que
 * el movimiento tiene que venir solo, y las marquesinas son la única animación
 * infinita que el sistema admite. Con movimiento reducido no se monta: en su
 * lugar va la grilla quieta de `HeroParallax`.
 *
 * Las duraciones son distintas a propósito: la izquierda siempre tiene igual o
 * más tarjetas (se lleva los índices pares) y es más alta, así que tarda un
 * poco más para ir a un ritmo parecido; al correr en sentidos opuestos, las
 * dos nunca se alinean.
 */
const DriftingColumns = ({ products }: { products: ParallaxProduct[] }) => {
  const [left, right] = splitInColumns(products);

  return (
    <div
      aria-hidden="true"
      className="relative mt-8 h-[66svh] min-h-96 overflow-hidden md:hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
    >
      {/* Más alto que su marco e inclinado: el sobrante lo recorta el
          `overflow-hidden` y la escala tapa las esquinas que la rotación
          dejaría libres. */}
      <div className="absolute inset-x-0 -inset-y-[6%] flex -rotate-4 scale-[1.08] gap-3 px-[var(--spacing-gutter)]">
        <Marquee vertical repeat={3} duration="58s" gap="0.75rem" className="min-w-0 flex-1">
          {left.map((product, index) => (
            <ScreenLink
              key={`${product.thumbnail}-${index}`}
              product={product}
              sizes="44vw"
              label="mono"
            />
          ))}
        </Marquee>
        <Marquee
          vertical
          reverse
          repeat={3}
          duration="52s"
          gap="0.75rem"
          className="min-w-0 flex-1"
        >
          {right.map((product, index) => (
            <ScreenLink
              key={`${product.thumbnail}-${index}`}
              product={product}
              sizes="44vw"
              label="mono"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};
