import Image from "next/image";
import type { CSSProperties } from "react";

import { ActionLink } from "@/components/primitives/actions";
import { PendingNote } from "@/components/primitives/pending-note";
import { Reveal } from "@/components/primitives/reveal";
import { Section, SectionLabel } from "@/components/primitives/section";
import { MacbookScroll, SnapCarousel, SnapSlide, TiltScreen } from "@/components/ui/macbook-scroll";
import { featuredProject } from "@/content/projects";
import type { ProductArea } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Rienda por dentro. Una de las cinco, no la dueña del sitio.
 *
 * Tres tiempos, en menos de tres pantallas: la afirmación (tagline y bajada),
 * el momento fuerte (la pantalla Vender abriéndose en la notebook al hacer
 * scroll) y las otras cinco áreas en una tira horizontal, compactas, para que
 * el recorrido completo siga estando sin ocupar seis pantallas como antes.
 *
 * Todo el texto sale del contenido del caso: el título de la notebook es la
 * primera oración de "La visión" y el cierre es la segunda. Acá no se escribe
 * copy nuevo, solo se elige qué frase va en qué lugar.
 *
 * En pantallas chicas la notebook no entra: la misma captura, sola en su
 * `.screen` y con la misma frase arriba, se endereza y se enciende mientras
 * entra en la ventana (`TiltScreen`; desde `md` vuelve la notebook). La tira
 * de áreas, debajo de `lg`, enciende la tarjeta que está a la vista y atenúa
 * las vecinas, y suma un indicador de posición con puntos (`SnapCarousel` y
 * `SnapSlide`). En escritorio la tira sigue como estaba.
 */
export function RiendaFeature() {
  const project = featuredProject;
  const [hero, ...rest] = project.areas;
  const shot = hero?.shot ?? project.cover;
  const siteLink = project.links[0];

  const vision = project.blocks.find((block) => block.id === "vision")?.paragraphs ?? [];
  const [visionLead, visionClose] = [firstSentence(vision[0]), vision[1]];

  // El brillo va en la última palabra del tagline, no en el párrafo.
  const [taglineHead, taglineGlow] = splitLastWord(project.tagline);

  return (
    <Section id="rienda" labelledBy="rienda-titulo" bleed>
      <div className="shell">
        <div className="grid12 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <SectionLabel>Rienda por dentro</SectionLabel>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 id="rienda-titulo" className="text-h2 mt-10 max-w-[16ch]">
                {taglineHead} <span className="text-glow">{taglineGlow}</span>
              </h2>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
            <Reveal delay={0.1}>
              <p className="text-paper-muted text-lead measure">{project.summary}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-paper-faint text-micro mt-7 font-mono">
                {[project.name, project.role, project.year].join(" · ")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Escritorio: la notebook se abre con el scroll. */}
      <div className="mt-[var(--spacing-section-sm)] hidden md:block">
        <MacbookScroll
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          title={visionLead}
          accent={project.accent}
        />
      </div>

      {/* Pantalla chica: la misma captura se endereza al entrar, con la misma frase. */}
      <div className="shell mt-14 md:hidden">
        {visionLead ? (
          <Reveal>
            <p className="text-h4 measure-wide">{visionLead}</p>
          </Reveal>
        ) : null}
        <TiltScreen
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          accent={project.accent}
          className="mt-6"
        />
      </div>

      {rest.length > 0 ? (
        <AreaStrip
          subject={project.name}
          areas={rest}
          accent={project.accent}
          note={project.shotsDisclaimer}
        />
      ) : (
        <div className="shell mt-10">
          <PendingNote>Áreas del producto para el recorrido</PendingNote>
        </div>
      )}

      <div className="shell mt-[var(--spacing-section-sm)]">
        <div className="hairline-t grid12 gap-y-8 pt-10">
          {visionClose ? (
            <Reveal className="col-span-12 lg:col-span-6">
              <p className="text-lead measure-wide">{visionClose}</p>
            </Reveal>
          ) : null}

          <Reveal
            delay={0.08}
            className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end lg:self-center"
          >
            <ActionLink href={`/proyectos/${project.slug}`}>
              Ver el caso completo
            </ActionLink>
            {siteLink ? (
              <ActionLink href={siteLink.href} external variant="secondary">
                {siteLink.label}
              </ActionLink>
            ) : null}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

type AccentStyle = CSSProperties & { "--accent": string };

/**
 * Las otras áreas, en una tira con scroll horizontal y snap. Cada captura va
 * en un `.screen` con el borde del color del proyecto; abajo, rótulo y título
 * (un `h3` por área, para que se pueda saltar entre ellas por encabezados).
 * La tira arranca en el gutter y sangra a la derecha.
 *
 * Debajo de `lg` manda la posición, no el puntero: cada tarjeta es un
 * `SnapSlide` que marca `data-active` cuando ocupa la ventana de la tira, y
 * con eso su marco sube a opacidad plena, tamaño pleno y borde del color del
 * proyecto mientras las vecinas quedan a 0,7 y apenas más chicas. Debajo, un
 * punto por área marca cuál está a la vista y lleva a ella al tocarlo
 * (`SnapCarousel`). Las capturas no llevan `ScrollParallax`: el marco es
 * 16:10 exacto como la captura, así que flotar obligaría a recortar un 10 por
 * ciento de una pantalla ya chica, y en una tira que se recorre en horizontal
 * el desplazamiento vertical no suma.
 *
 * Las capturas van con `fill` sobre el `.screen` (que fija la proporción):
 * así el alto de la imagen no depende de resolver un porcentaje contra un
 * `aspect-ratio`, que era la única vía por la que un marco podía quedar vacío.
 */
function AreaStrip({
  subject,
  areas,
  accent,
  note,
}: {
  /** Nombre del producto, para nombrar la región a los lectores de pantalla. */
  subject: string;
  areas: ProductArea[];
  accent: string;
  /** Aviso de que los datos de las capturas son de demostración. */
  note?: string;
}) {
  const style: AccentStyle = { "--accent": accent };

  return (
    <Reveal threshold="loose" className="mt-[var(--spacing-section-sm)]">
      <div className="shell">
        <p className="text-paper-faint text-micro font-mono">Las demás áreas del producto</p>
      </div>

      <SnapCarousel
        label={`Áreas de ${subject}`}
        items={areas.map((area) => ({ id: area.id, label: area.label }))}
        style={style}
        className="mt-6 snap-x snap-mandatory overflow-x-auto pb-4 [scroll-padding-inline:var(--spacing-gutter)] [scrollbar-width:thin]"
        indicatorClassName="shell lg:hidden"
      >
        <ul className="flex w-max gap-5 px-[var(--spacing-gutter)] md:gap-7">
          {areas.map((area, index) => (
            <SnapSlide key={area.id} index={index} className="w-[min(34rem,82vw)] shrink-0 snap-start">
              <figure>
                <div
                  className={cn(
                    "screen relative aspect-[16/10] border border-[color:color-mix(in_oklab,var(--accent)_30%,transparent)]",
                    // Foco por posición, solo debajo de `lg`. En Tailwind v4 `scale-*`
                    // escribe la propiedad `scale`, por eso la transición la nombra.
                    "max-lg:scale-[0.97] max-lg:opacity-70 max-lg:transition-[opacity,scale,border-color] max-lg:duration-400 max-lg:ease-[var(--ease-out-quint)]",
                    "max-lg:group-data-active:scale-100 max-lg:group-data-active:opacity-100 max-lg:group-data-active:border-[color:color-mix(in_oklab,var(--accent)_60%,transparent)]",
                  )}
                >
                  <Image
                    src={area.shot.src}
                    alt={area.shot.alt}
                    fill
                    sizes="(min-width: 768px) 544px, 82vw"
                    className="object-cover object-left-top"
                  />
                </div>
                <figcaption className="mt-4 flex flex-col gap-1.5 md:flex-row md:items-baseline md:gap-4">
                  <span className="text-jade text-micro shrink-0 font-mono">{area.label}</span>
                  <h3 className="text-h4 text-paper">{area.title}</h3>
                </figcaption>
              </figure>
            </SnapSlide>
          ))}
        </ul>
      </SnapCarousel>

      {note ? (
        <div className="shell">
          <p className="text-paper-faint text-micro mt-3 max-w-[52ch]">{note}</p>
        </div>
      ) : null}
    </Reveal>
  );
}

/** Primera oración de un párrafo, con su punto. `undefined` si no hay texto. */
function firstSentence(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

/** Separa la última palabra para poder darle brillo sin tocar el contenido. */
function splitLastWord(text: string): [string, string] {
  const cut = text.lastIndexOf(" ");
  if (cut === -1) return ["", text];
  return [text.slice(0, cut), text.slice(cut + 1)];
}
