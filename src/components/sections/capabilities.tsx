import { SectionLabel } from "@/components/primitives/section";
import { BlurFade } from "@/components/ui/blur-fade";
import { capabilities } from "@/content/capabilities";

/**
 * Capacidades.
 *
 * Cuatro columnas de texto plano sobre noche. Sin cajas, sin píldoras y sin
 * bordes alrededor: la única línea es la hairline que abre cada columna, que
 * alcanza para agrupar. Cada grupo dice para qué sirve antes de enumerar,
 * porque una lista de tecnologías sin contexto no informa nada.
 */
export function Capabilities() {
  return (
    <section
      id="capacidades"
      aria-labelledby="capacidades-titulo"
      className="py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="measure-wide">
          <BlurFade inView>
            <SectionLabel className="w-fit">Capacidades</SectionLabel>
          </BlurFade>

          <BlurFade inView delay={0.06}>
            <h2 id="capacidades-titulo" className="text-h2 mt-8 max-w-[18ch]">
              Lo que sé hacer, y para qué lo uso.
            </h2>
          </BlurFade>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {capabilities.map((group, index) => (
            <BlurFade key={group.id} inView delay={index * 0.08} className="hairline-t pt-5">
              <h3 className="text-h4">{group.title}</h3>

              <p className="text-paper-muted text-micro mt-3 max-w-[32ch]">{group.intro}</p>

              <ul className="text-paper mt-7 flex flex-col gap-2.5 text-[0.9375rem]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
