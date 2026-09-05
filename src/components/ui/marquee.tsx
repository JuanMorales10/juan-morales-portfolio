import { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Marquee, componente de 21st.dev, de Magic UI.
// https://magicui.design/docs/components/marquee
//
// Una tira de contenido que se desplaza en bucle, sin JavaScript: el contenido
// se repite N veces y una animación de CSS corre exactamente una copia. Acá es
// la franja de stack debajo del hero, en `sections/stack-marquee.tsx`.
//
// Qué se cambió del original y por qué. Si se actualiza desde el registro, hay
// que volver a aplicar esto:
//
// 1. **Los keyframes viven acá.** El original espera `animate-marquee` y
//    `animate-marquee-vertical` definidos en la configuración de Tailwind, que
//    este proyecto no tiene (Tailwind v4 sin archivo de configuración). Van en
//    un `<style>` con `precedence`: React lo sube al `<head>` una sola vez por
//    página aunque haya varias marquesinas.
// 2. **Movimiento reducido.** Con `prefers-reduced-motion` la tira no se
//    mueve: queda la primera copia, quieta y legible. Es la única animación
//    infinita que el sistema admite, y solo mientras nadie pidió lo contrario.
// 3. **`duration` como prop.** Una tira de veintitantos ítems y otra de cuatro
//    no pueden correr con el mismo tiempo si tienen que ir a la misma velocidad.
// 4. **Sin `p-2`.** El relleno lo decide la sección que la monta.

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  /** Invierte el sentido. */
  reverse?: boolean;
  /** Pausa al pasar el puntero. */
  pauseOnHover?: boolean;
  children: ReactNode;
  /** Vertical en vez de horizontal. */
  vertical?: boolean;
  /** Cuántas veces se repite el contenido. Tiene que cubrir el ancho más una copia. */
  repeat?: number;
  /** Tiempo de una vuelta completa, como valor CSS. */
  duration?: string;
  /** Separación entre ítems y entre copias, como valor CSS. */
  gap?: string;
}

const KEYFRAMES = `
@keyframes jm-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}
@keyframes jm-marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}
.jm-marquee-track {
  animation: jm-marquee var(--duration) linear infinite;
}
.jm-marquee-track[data-vertical] {
  animation-name: jm-marquee-vertical;
}
.jm-marquee-track[data-reverse] {
  animation-direction: reverse;
}
.jm-marquee[data-pause]:hover .jm-marquee-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .jm-marquee-track {
    animation: none;
  }
}
`;

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "1rem",
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      data-pause={pauseOnHover ? "" : undefined}
      style={{ "--duration": duration, "--gap": gap, ...style } as CSSProperties}
      className={cn(
        "jm-marquee flex gap-(--gap) overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      <style href="jm-marquee" precedence="default">
        {KEYFRAMES}
      </style>
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          data-vertical={vertical ? "" : undefined}
          data-reverse={reverse ? "" : undefined}
          className={cn(
            "jm-marquee-track flex shrink-0 justify-around gap-(--gap)",
            vertical ? "flex-col" : "flex-row",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
