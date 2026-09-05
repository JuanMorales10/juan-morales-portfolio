import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { SectionLabel } from "@/components/primitives/section";
import { intro } from "@/content/profile";

/**
 * Presentación.
 *
 * Es el respiro después del hero, así que la sección hace una sola cosa: una
 * columna de lectura corta a la izquierda y, al pie de la derecha, tres datos
 * en monoespaciada. Las notas se alinean abajo y no arriba: ese desfase
 * vertical es lo que evita que se lea como dos columnas gemelas.
 *
 * Entre las dos columnas queda una vacía en toda pantalla ancha. Es aire
 * deliberado: si se tocan, las notas dejan de leerse como margen y pasan a
 * parecer una segunda columna de texto.
 *
 * Todo entra con `Reveal` al aparecer en la ventana, en cualquier ancho. Las
 * notas van en un grupo propio: dispara cuando la lista misma entra en
 * pantalla (no cuando entra el lead), así en el teléfono, donde quedan lejos
 * del texto, aparecen recién cuando se las ve.
 */
export function Intro() {
  return (
    <section aria-labelledby="intro-titulo" className="py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid12 gap-y-14">
          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <Reveal>
              <SectionLabel>{intro.eyebrow}</SectionLabel>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 id="intro-titulo" className="text-h3 measure mt-10">
                {intro.lead}
              </h2>
            </Reveal>

            <RevealGroup stagger={0.07} className="mt-8 flex flex-col gap-5">
              {intro.paragraphs.map((paragraph) => (
                <RevealItem
                  key={paragraph}
                  as="p"
                  className="text-body text-paper-muted measure"
                >
                  {paragraph}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <RevealGroup
            as="dl"
            className="col-span-12 flex flex-col gap-6 self-end md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10"
          >
            {intro.asides.map((aside) => (
              <RevealItem key={aside.label} className="hairline-t pt-3">
                <dt className="text-paper-faint text-micro font-mono">{aside.label}</dt>
                <dd className="text-paper text-micro mt-1.5 font-mono">{aside.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
