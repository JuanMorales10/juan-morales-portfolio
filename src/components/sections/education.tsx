import { SectionLabel } from "@/components/primitives/section";
import { BlurFade } from "@/components/ui/blur-fade";
import { credentials } from "@/content/experience";

/**
 * Formación.
 *
 * Ficha densa, no tarjetas: el encabezado se corre a una columna lateral y cada
 * credencial ocupa una fila de tres campos, institución, programa y detalles,
 * separada por hairlines. En mobile los tres campos se apilan en ese mismo
 * orden de lectura. Cada fila entra con BlurFade, una detrás de otra.
 */
export function Education() {
  return (
    <section
      id="formacion"
      aria-labelledby="formacion-titulo"
      className="py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="grid12 gap-y-10">
          <div className="col-span-12 lg:col-span-4 lg:pr-10">
            <BlurFade inView>
              <SectionLabel>Formación</SectionLabel>
            </BlurFade>

            <BlurFade inView delay={0.06}>
              <h2 id="formacion-titulo" className="text-h3 mt-6 max-w-[14ch]">
                Dónde me formé y qué incluyó cada programa.
              </h2>
            </BlurFade>
          </div>

          <div className="hairline-b col-span-12 lg:col-span-8">
            {credentials.map((credential, index) => (
              <BlurFade
                key={credential.id}
                inView
                delay={index * 0.08}
                className="hairline-t"
              >
                <article
                  aria-labelledby={`formacion-${credential.id}`}
                  className="grid gap-x-8 gap-y-4 py-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1.3fr)] md:py-10"
                >
                  <div>
                    <h3 id={`formacion-${credential.id}`} className="text-h4">
                      {credential.institution}
                    </h3>
                    <p className="text-paper-faint text-micro mt-2 font-mono">
                      {credential.period}
                    </p>
                  </div>

                  <p className="text-body text-paper">{credential.program}</p>

                  <div>
                    <ul className="text-paper-muted text-micro flex flex-col gap-2">
                      {credential.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>

                    {credential.note ? (
                      <p className="text-paper-faint text-micro mt-5">{credential.note}</p>
                    ) : null}
                  </div>
                </article>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
