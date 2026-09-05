import type { Metadata } from "next";

import { ActionLink } from "@/components/primitives/actions";
import { Reveal } from "@/components/primitives/reveal";
import { ProjectCards } from "@/components/projects/project-cards";
import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";

const description =
  "Los proyectos publicados de Juan Morales, con el problema, las decisiones y las pantallas reales de cada uno.";

export const metadata: Metadata = {
  title: "Proyectos",
  description,
  alternates: { canonical: "/proyectos" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: `${site.url}/proyectos`,
    siteName: site.name,
    title: `Proyectos · ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Proyectos · ${site.name}`,
    description,
  },
};

/**
 * Índice de proyectos.
 *
 * La misma grilla de tarjetas que la home, con todos los proyectos y un filtro
 * por tipo. Los nombres van en h2 porque acá el h1 es de la página. Los
 * borradores no llegan: `publishedProjects` los deja afuera incluso en
 * desarrollo, así que el índice muestra siempre lo mismo que ve un visitante.
 */
export default function ProyectosPage() {
  return (
    <main id="contenido">
      <div className="shell pt-28 md:pt-36">
        <Reveal>
          <h1 className="text-h1">Proyectos</h1>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="text-paper-muted text-lead measure-wide mt-8">
            Cada proyecto tiene su caso de estudio: qué problema resolvía, cómo está
            construido y qué decisiones lo explican. Sin métricas que no pueda
            respaldar.
          </p>
        </Reveal>
      </div>

      <div className="shell py-[var(--spacing-section-sm)]">
        {publishedProjects.length > 0 ? (
          <ProjectCards projects={publishedProjects} headingLevel={2} columns={3} filterable />
        ) : null}

        <div className="hairline-t grid12 mt-[var(--spacing-section-sm)] gap-y-8 pt-10">
          <Reveal className="col-span-12 lg:col-span-6">
            <p className="text-paper-muted measure text-body">
              Si querés conversar sobre alguno de estos proyectos, o sobre uno nuevo,
              escribime.
            </p>
          </Reveal>

          <Reveal
            delay={0.06}
            className="col-span-12 flex lg:col-span-4 lg:col-start-9 lg:justify-end"
          >
            <ActionLink href="/#contacto" variant="secondary">
              Hablemos de un proyecto
            </ActionLink>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
