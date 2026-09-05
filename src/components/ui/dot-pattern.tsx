import { type SVGProps, useId } from "react";

import { cn } from "@/lib/utils";

// Dot Pattern, componente de 21st.dev, de Magic UI.
// https://magicui.design/docs/components/dot-pattern
//
// Una trama de puntos que llena su contenedor. Acá es la textura tenue detrás
// del titular del hero, en `sections/hero.tsx`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **Un `<pattern>` en vez de miles de círculos.** El original medía el
//    contenedor con un efecto, guardaba el tamaño en estado y dibujaba un
//    `<circle>` por punto: sobre un hero de 1440 x 900 son más de mil nodos y,
//    con `glow`, más de mil animaciones infinitas a la vez. Un `<pattern>` de
//    SVG dibuja lo mismo con un solo `<rect>`, sin medir nada y sin
//    JavaScript, así que además se renderiza en el servidor.
// 2. **`glow` sin pulso.** El brillo era una animación infinita de opacidad y
//    escala por punto, y el sistema no admite nada infinito fuera de las
//    marquesinas. Acá `glow` conserva el relleno radial (cada punto se
//    desvanece hacia el borde, que es lo que se veía como brillo) y nada late.
// 3. **Color por token.** Venía en `text-neutral-400/80`; pasa a `text-jade`.
//    La intensidad la pone quien lo monta, con `opacity-*` en `className`.
// 4. **Tipos.** Se quitó el índice `[key: string]: unknown`, que dejaba pasar
//    cualquier prop sin chequear; alcanza con `SVGProps<SVGSVGElement>`.

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  /** Separación horizontal entre puntos, en píxeles. */
  width?: number;
  /** Separación vertical entre puntos, en píxeles. */
  height?: number;
  /** Corrimiento de toda la trama. */
  x?: number;
  y?: number;
  /** Posición de cada punto dentro de su celda. */
  cx?: number;
  cy?: number;
  /** Radio de cada punto. */
  cr?: number;
  className?: string;
  /** Puntos con relleno radial, que se apagan hacia el borde. */
  glow?: boolean;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const gradientId = `${id}-gradient`;
  const patternId = `${id}-pattern`;

  return (
    <svg
      aria-hidden="true"
      className={cn("text-jade pointer-events-none absolute inset-0 h-full w-full", className)}
      {...props}
    >
      <defs>
        {glow ? (
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        ) : null}
        <pattern
          id={patternId}
          width={width}
          height={height}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} fill={glow ? `url(#${gradientId})` : "currentColor"} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
