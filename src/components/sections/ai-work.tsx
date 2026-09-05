import type { ReactNode } from "react";

import { Section, SectionLabel } from "@/components/primitives/section";
import { BlurFade } from "@/components/ui/blur-fade";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { aiSection, howIWork } from "@/content/approach";

/**
 * Resalta una palabra del titular con `.text-glow`. Si el contenido cambia y
 * la palabra ya no está, el titular se muestra entero y sin brillo.
 */
function GlowWord({ text, word }: { text: string; word: string }) {
  const index = text.indexOf(word);
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="text-glow">{word}</span>
      {text.slice(index + word.length)}
    </>
  );
}

/**
 * El cierre dentro del borde jade que gira. En escritorio la luz se expande al
 * pasar el puntero; en el teléfono no hay puntero, así que debajo de `lg` el
 * borde se enciende una sola vez cuando el bloque llega a la franja central de
 * la ventana: un anillo jade con brillo que aparece por opacidad encima del
 * borde. Lo hace el `BlurFade` compartido con desenfoque y desplazamiento en
 * cero (queda solo el fundido), así la sección sigue siendo de servidor y no
 * hace falta un hook propio. El anillo es translúcido a propósito: la luz que
 * gira sigue viéndose debajo, que es lo único que se mueve en este bloque. En
 * escritorio el anillo no existe (`lg:hidden`) y 1440 queda igual.
 */
function Closing({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <HoverBorderGradient
        as="div"
        duration={1.6}
        containerClassName="rounded-lg"
        className="max-w-[40rem] px-8 py-9 text-center md:px-14 md:py-12"
      >
        {children}
      </HoverBorderGradient>

      <BlurFade
        inView
        inViewMargin="-30% 0px -30% 0px"
        offset={0}
        blur="0px"
        duration={0.7}
        className="pointer-events-none absolute inset-0 lg:hidden"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg shadow-glow-sm inset-ring-1 inset-ring-jade/60"
        />
      </BlurFade>
    </div>
  );
}

/**
 * IA como herramienta de trabajo.
 *
 * Apertura con el titular de `aiSection` y "criterio" con brillo, porque esa es
 * la palabra que carga la frase. Debajo, los cuatro pilares de `howIWork` en
 * dos columnas separadas solo por hairlines: son cuatro ideas distintas, no
 * cuatro tarjetas iguales. Cierra con la frase de lo que no se delega, dentro
 * del borde jade que gira: es una afirmación, no un botón, por eso `as="div"`.
 *
 * Componente de servidor: el movimiento vive en `BlurFade` y en el borde, que
 * ya son de cliente, y el contenido sale de `src/content` ya resuelto.
 */
export function AiWork() {
  return (
    <Section id="ia" labelledBy="ia-titulo" className="border-t">
      <div className="grid12">
        <div className="col-span-12 lg:col-span-8">
          <BlurFade inView>
            <SectionLabel>{aiSection.eyebrow}</SectionLabel>
          </BlurFade>

          <BlurFade inView delay={0.08}>
            <h2 id="ia-titulo" className="text-h2 mt-10 max-w-[18ch]">
              <GlowWord text={aiSection.title} word="criterio" />
            </h2>
          </BlurFade>

          <BlurFade inView delay={0.16}>
            <p className="text-lead text-paper-muted measure-wide mt-8">{aiSection.lead}</p>
          </BlurFade>
        </div>
      </div>

      {/* Los pilares entran escalonados; en una columna, cada uno cuando aparece. */}
      <ul className="mt-16 grid border-b md:mt-24 md:grid-cols-2 md:gap-x-12">
        {howIWork.pillars.map((pillar, index) => (
          <li key={pillar.id} className="border-t">
            <BlurFade inView delay={index * 0.08} className="py-8 md:py-10">
              <h3 className="text-h4">{pillar.title}</h3>
              <p className="text-body text-paper-muted mt-3 max-w-[42ch]">{pillar.body}</p>
            </BlurFade>
          </li>
        ))}
      </ul>

      <div className="mt-20 flex justify-center md:mt-28">
        <BlurFade inView delay={0.1}>
          <Closing>
            <p className="text-h3 text-paper">{aiSection.closing}</p>
          </Closing>
        </BlurFade>
      </div>
    </Section>
  );
}
