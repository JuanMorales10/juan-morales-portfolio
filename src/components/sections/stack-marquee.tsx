import type { ReactNode } from "react";

import { Marquee } from "@/components/ui/marquee";
import { capabilities } from "@/content/capabilities";
import { cn } from "@/lib/utils";

/**
 * Franja de stack.
 *
 * Dos tiras que corren en sentidos opuestos entre dos hairlines: arriba, todas
 * las tecnologías y disciplinas de `capabilities`; abajo, los cuatro títulos de
 * grupo. Es decorativa y va `aria-hidden`: la misma información está, ordenada
 * y con contexto, en la sección Capacidades. Se pausa al pasar el puntero y no
 * se mueve con movimiento reducido.
 *
 * El `.meta` va una sola vez, en el contenedor: las dos tiras lo heredan. Las
 * duraciones están calculadas para que las dos corran a una velocidad parecida
 * (la de arriba es unas cinco veces más larga que la de abajo).
 *
 * En el teléfono las dos tiras corren un 30% más rápido y la de abajo sube a
 * `paper-muted`: es de las pocas cosas que se mueven solas en la primera
 * pantalla y a 390 px tiene que sentirse viva, no apenas deslizarse. La
 * duración entra por una variable CSS por tira (`--d`) porque el `Marquee` la
 * fija con `style` inline y una clase `max-lg:` no podría pisarla directo.
 */
export function StackMarquee() {
  const items = capabilities.flatMap((group) => group.items);
  const groups = capabilities.map((group) => group.title);

  return (
    <div aria-hidden="true" className="meta hairline-t hairline-b bg-night-900 py-5 md:py-6">
      <Marquee
        pauseOnHover
        repeat={3}
        duration="var(--d)"
        gap="2.5rem"
        className="[--d:110s] max-lg:[--d:76s]"
      >
        {items.map((item) => (
          <Item key={item} className="text-paper-muted">
            {item}
          </Item>
        ))}
      </Marquee>

      <Marquee
        pauseOnHover
        reverse
        repeat={6}
        duration="var(--d)"
        gap="2.5rem"
        className="mt-4 [--d:22s] max-lg:[--d:15s]"
      >
        {groups.map((group) => (
          <Item key={group} className="max-lg:text-paper-muted">
            {group}
          </Item>
        ))}
      </Marquee>
    </div>
  );
}

/** Un ítem y el punto medio que lo separa del siguiente, con la misma separación de la tira. */
function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("flex items-center gap-(--gap) text-[0.8rem] whitespace-nowrap", className)}>
      {children}
      <span className="text-jade">·</span>
    </span>
  );
}
