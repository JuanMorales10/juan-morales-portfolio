import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { DirectionalLink } from "@/components/primitives/actions";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { SharedElement } from "@/components/primitives/shared-element";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import type { Project } from "@/content/types";

/**
 * Portada del caso de estudio.
 *
 * Arriba, el nombre del proyecto en el cuerpo más grande del sitio apoyado
 * contra la ficha técnica, que ocupa la columna derecha como un riel de datos.
 * Debajo, la portada dentro de `ContainerScroll`: entra inclinada como una
 * pantalla apoyada sobre la mesa y se endereza al hacer scroll. Detrás, un velo
 * con el color de la marca del proyecto, que es el único lugar donde ese color
 * aparece en la página.
 *
 * El nombre y la portada se envuelven en `SharedElement` con los mismos
 * nombres que usa la grilla de proyectos (`titulo-<slug>` y `portada-<slug>`):
 * React empareja los dos nodos y el navegador los continúa en lugar de
 * redibujarlos. Por eso ninguno de los dos entra con animación propia acá.
 */
export function CaseHero({ project }: { project: Project }) {
  const rows = fichaRows(project);

  return (
    <section aria-labelledby="caso-titulo" className="pt-28 md:pt-36">
      <div className="shell">
        <Reveal className="hairline-b flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-4">
          <span className="meta">Caso de estudio</span>
          <DirectionalLink
            href="/proyectos"
            className="text-micro text-paper-muted hover:text-jade"
          >
            Todos los proyectos
          </DirectionalLink>
        </Reveal>

        {/* `items-end` deja que la ficha, más alta, empuje el nombre hacia abajo. */}
        <div className="grid12 mt-14 items-end gap-y-12 md:mt-20">
          <div className="col-span-12 lg:col-span-7">
            <h1 id="caso-titulo" className="text-display">
              <SharedElement name={`titulo-${project.slug}`}>
                <span className="inline-block">{project.name}</span>
              </SharedElement>
            </h1>
            <Reveal delay={0.06}>
              <p className="text-lead text-paper-muted measure mt-7">{project.tagline}</p>
            </Reveal>
          </div>

          <RevealGroup
            as="dl"
            stagger={0.05}
            className="text-micro col-span-12 border-t font-mono leading-relaxed sm:col-span-10 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pl-8"
          >
            {rows.map((row) => (
              <RevealItem
                key={row.label}
                className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 border-b py-3.5"
              >
                <dt className="text-paper-faint">{row.label}</dt>
                <dd className="text-paper-muted">{row.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* `overflow-x-clip` y no `hidden`: recorta lo que la perspectiva saca por
          los costados al principio del recorrido sin crear un contenedor de
          scroll, así la página no gana una barra horizontal. */}
      <div className="relative mt-10 overflow-x-clip md:mt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 50% 55%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 72%)",
          }}
        />

        <figure className="shell relative">
          <ContainerScroll
            titleComponent={
              <p className="text-h2 text-paper">
                La pantalla, <span className="text-glow">de cerca</span>.
              </p>
            }
          >
            <SharedElement name={`portada-${project.slug}`}>
              {/* Recorta con el radio del marco: la captura que toma la View
                  Transition sale redondeada, igual que la de las tarjetas. */}
              <div className="w-full overflow-hidden rounded-[inherit]">
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(max-width: 1280px) 94vw, 1184px"
                  priority
                  className="h-auto w-full"
                />
              </div>
            </SharedElement>
          </ContainerScroll>

          {project.shotsDisclaimer ? (
            <Reveal
              as="figcaption"
              className="text-paper-faint text-micro measure-wide mx-auto mt-4 text-center font-mono md:mt-6"
            >
              {project.shotsDisclaimer}
            </Reveal>
          ) : null}
        </figure>
      </div>
    </section>
  );
}

/** Estilo con el acento del proyecto, para el velo detrás de la portada. */
export function accentStyle(accent: string): CSSProperties {
  const style: CSSProperties & { "--accent": string } = { "--accent": accent };
  return style;
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

function parseMonth(iso: string): { month: string; year: string } | null {
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!year || !name) return null;
  return { month: name, year };
}

/**
 * Período legible a partir de `start` y `end` en `YYYY-MM`. Si la fecha no se
 * puede leer, cae en `project.year`, que ya viene escrito para pantalla.
 */
export function formatPeriod(start: string, end: string | null, fallback: string): string {
  const from = parseMonth(start);
  if (!from) return fallback;

  let text: string;

  if (end === null) {
    text = `${from.month} de ${from.year} a hoy`;
  } else {
    const to = parseMonth(end);
    if (!to) return fallback;

    if (start === end) {
      text = `${from.month} de ${from.year}`;
    } else if (from.year === to.year) {
      text = `${from.month} a ${to.month} de ${from.year}`;
    } else {
      text = `${from.month} de ${from.year} a ${to.month} de ${to.year}`;
    }
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Ficha técnica. Las etiquetas van en minúscula: siete rótulos en mayúsculas
 * seguidos serían justo el abuso de `.meta` que el sistema prohíbe.
 */
function fichaRows(project: Project): Array<{ label: string; value: ReactNode }> {
  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: "rol", value: project.role },
    { label: "tipo", value: project.kind },
  ];

  if (project.client) {
    rows.push({ label: "cliente", value: project.client });
  }

  rows.push(
    { label: "período", value: formatPeriod(project.start, project.end, project.year) },
    { label: "disciplinas", value: project.disciplines.join(", ") },
    { label: "stack", value: project.stack.join(", ") },
  );

  // El texto de cada enlace es el del contenido ("Visitar rienda.ar", "Sitio de
  // Poltrona"): dice qué hay del otro lado. Un rótulo "sitio" con el dominio
  // pelado haría pasar el sitio de un cliente por el del proyecto.
  if (project.links.length > 0) {
    rows.push({
      label: project.links.length === 1 ? "enlace" : "enlaces",
      value: (
        <span className="flex flex-col items-start gap-1.5">
          {project.links.map((link) => (
            <DirectionalLink
              key={link.href}
              href={link.href}
              external
              className="text-paper hover:text-jade"
              printUrl={link.printAs}
            >
              {link.label}
            </DirectionalLink>
          ))}
        </span>
      ),
    });
  }

  return rows;
}
