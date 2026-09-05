import Image from "next/image";

import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/reveal";
import type { CaseBlock, ProductArea } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * El primer ítem de la tira arranca alineado con la grilla del sitio y no con
 * el borde de la ventana, aunque la tira sea a sangre. `96rem` es el techo de
 * `.shell`.
 */
const EDGE_PADDING =
  "max(var(--spacing-gutter), calc((100% - 96rem) / 2 + var(--spacing-gutter)))";

/**
 * Cuerpo narrativo del caso.
 *
 * Es lo único del sitio que se lee como un artículo: encabezado corrido al
 * margen izquierdo, que queda pegajoso mientras dura su bloque, y la prosa en
 * una sola columna de medida corta. El primer párrafo entra un cuerpo más
 * grande, en papel pleno, para que se note dónde empieza cada idea; el resto
 * baja a papel apagado.
 *
 * Los ítems son una lista con hairlines, no tarjetas: son enumeraciones dentro
 * de un texto, no objetos separados que se puedan comparar entre sí.
 *
 * Si el proyecto declara áreas, después de los bloques va una tira horizontal
 * con una captura por área: la evidencia de lo que la prosa acaba de contar.
 */
export function CaseBlocks({ blocks, areas }: { blocks: CaseBlock[]; areas: ProductArea[] }) {
  if (blocks.length === 0 && areas.length === 0) return null;

  return (
    <div className="py-[var(--spacing-section)]">
      {blocks.length > 0 ? (
        <div className="shell flex flex-col gap-[var(--spacing-section-sm)]">
          {blocks.map((block) => {
            const titleId = `bloque-${block.id}-titulo`;
            const hasParagraphs = block.paragraphs.length > 0;
            const hasBullets = Boolean(block.bullets && block.bullets.length > 0);

            return (
              <section
                key={block.id}
                id={`bloque-${block.id}`}
                aria-labelledby={titleId}
                className="grid12 gap-y-8"
              >
                {/* `self-start` es lo que permite que el encabezado se despegue:
                    sin eso el ítem se estira a la altura de la fila y no viaja. */}
                <Reveal className="col-span-12 lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
                  <h2 id={titleId} className="text-h3 text-paper">
                    {block.heading}
                  </h2>
                </Reveal>

                <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                  {hasParagraphs ? (
                    <RevealGroup className="flex flex-col gap-6" stagger={0.06} threshold="loose">
                      {block.paragraphs.map((paragraph, index) => (
                        <RevealItem
                          as="p"
                          key={paragraph}
                          className={cn(
                            "measure",
                            index === 0 ? "text-lead text-paper" : "text-body text-paper-muted",
                          )}
                        >
                          {paragraph}
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  ) : null}

                  {hasBullets && block.bullets ? (
                    <RevealGroup
                      as="ul"
                      stagger={0.05}
                      threshold="loose"
                      className={cn("measure-wide border-b", hasParagraphs && "mt-12")}
                    >
                      {block.bullets.map((bullet) => (
                        <RevealItem
                          as="li"
                          key={bullet}
                          className="text-body text-paper-muted flex gap-4 border-t py-4"
                        >
                          <span
                            aria-hidden="true"
                            className="bg-jade mt-[0.62em] h-1 w-1 shrink-0 rounded-full"
                          />
                          <span>{bullet}</span>
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {areas.length > 0 ? (
        <AreasStrip areas={areas} className={blocks.length > 0 ? "mt-[var(--spacing-section)]" : undefined} />
      ) : null}
    </div>
  );
}

/**
 * Tira de áreas del producto. Una pantalla por área, con su rótulo, su título
 * y la explicación debajo. Es una lista con scroll horizontal y snap: en el
 * teléfono se recorre con el pulgar y en el escritorio con la rueda o la barra,
 * que se deja visible. El contenedor recibe foco para que también se pueda
 * recorrer con las flechas del teclado.
 */
function AreasStrip({ areas, className }: { areas: ProductArea[]; className?: string }) {
  return (
    <section id="areas" aria-labelledby="areas-titulo" className={className}>
      <div className="shell">
        <Reveal className="grid12 gap-y-4">
          <h2 id="areas-titulo" className="text-h3 text-paper col-span-12 lg:col-span-3">
            Por dentro
          </h2>
          <p className="text-body text-paper-muted col-span-12 lg:col-span-5 lg:col-start-5">
            Una pantalla por área del producto, con lo que resuelve cada una.
          </p>
        </Reveal>
      </div>

      <Reveal threshold="loose" className="mt-10 md:mt-14">
        <div
          role="region"
          aria-label="Áreas del producto"
          tabIndex={0}
          className="snap-x snap-mandatory overflow-x-auto pb-6"
          style={{
            scrollPaddingInline: EDGE_PADDING,
            scrollbarWidth: "thin",
            scrollbarColor: "var(--hairline-strong) transparent",
          }}
        >
          <ul className="flex w-max items-start gap-6 md:gap-8" style={{ paddingInline: EDGE_PADDING }}>
            {areas.map((area) => (
              <li key={area.id} className="w-[min(84vw,44rem)] shrink-0 snap-start">
                <figure>
                  <div className="screen">
                    <Image
                      src={area.shot.src}
                      alt={area.shot.alt}
                      width={area.shot.width}
                      height={area.shot.height}
                      sizes="(max-width: 840px) 84vw, 704px"
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="mt-6">
                    <p className="text-paper-faint text-micro font-mono">{area.label}</p>
                    <h3 className="text-h4 text-paper mt-2">{area.title}</h3>
                    <p className="text-body text-paper-muted measure mt-3">{area.body}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
