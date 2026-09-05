import Image from "next/image";
import type { CSSProperties } from "react";

import { ActionLink } from "@/components/primitives/actions";
import { Reveal } from "@/components/primitives/reveal";
import { SectionLabel } from "@/components/primitives/section";
import { SharedElement } from "@/components/primitives/shared-element";
import { ProjectCards } from "@/components/projects/project-cards";
import { ProjectsWall } from "@/components/projects/wall";
import { Lens } from "@/components/ui/lens";
import { ShineBorder } from "@/components/ui/shine-border";
import { featuredProject, otherProjects, projects } from "@/content/projects";
import type { Project } from "@/content/types";

/**
 * Proyectos: la sección más importante de la home.
 *
 * Tres tiempos. El destacado, con la portada grande dentro de un borde de luz
 * y una lupa para mirar el detalle; los demás en la grilla de tarjetas, donde
 * la que se señala queda nítida y las otras ceden; y el muro, a sangre, con
 * todas las capturas de todos los proyectos girando en perspectiva.
 *
 * Nada acá sabe cuántos proyectos hay: el destacado es el primero del registro
 * y la grilla absorbe los que vengan.
 */
export function Projects() {
  // Se lo busca dentro de `projects` en vez de darlo por hecho: si algún día
  // pasa a borrador, tiene que desaparecer de la home igual que cualquier otro.
  const featured = projects.find((project) => project.slug === featuredProject.slug);
  const [lead, ...rest] = featured ? [featured, ...otherProjects] : otherProjects;

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="relative pt-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="grid12 items-end gap-y-6">
          <Reveal className="col-span-12 lg:col-span-7">
            <SectionLabel className="w-fit">Proyectos</SectionLabel>
            <h2 id="proyectos-titulo" className="text-h2 mt-8 max-w-[16ch]">
              Lo que construí, <span className="text-glow">funcionando</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-paper-muted text-body">
              Cada caso abre el problema, las decisiones y las pantallas reales del
              producto. Sin métricas que no pueda respaldar.
            </p>
          </Reveal>
        </div>

        {lead ? <FeaturedProject project={lead} /> : null}

        {rest.length > 0 ? (
          <div className="mt-[var(--spacing-section-sm)]">
            <ProjectCards projects={rest} headingLevel={3} columns={2} />
          </div>
        ) : null}

        <Reveal className="hairline-t mt-14 flex flex-wrap items-center justify-between gap-6 pt-8">
          <p className="text-paper-muted text-body">El índice completo de proyectos.</p>
          <ActionLink href="/proyectos" variant="secondary">
            Ver todos los proyectos
          </ActionLink>
        </Reveal>
      </div>

      <ProjectsWall className="mt-[var(--spacing-section)]" />
    </section>
  );
}

/**
 * El primer proyecto, en una fila grande: la portada ocupa siete columnas, con
 * el borde de luz en jade y en el color de la marca del proyecto, y al lado la
 * ficha corta. Portada y nombre son elementos compartidos con la página del
 * caso; la lupa queda dentro del `SharedElement` porque duplica a sus hijos y
 * un nombre de transición repetido la cancelaría.
 */
function FeaturedProject({ project }: { project: Project }) {
  const stack = project.stack.slice(0, 6);

  return (
    <article
      aria-labelledby={`destacado-${project.slug}`}
      style={{ "--accent": project.accent } as CSSProperties}
      className="grid12 mt-[var(--spacing-section-sm)] items-center gap-y-10"
    >
      <Reveal threshold="loose" className="col-span-12 lg:col-span-7">
        <div className="relative rounded-[var(--radius-md)]">
          {/* Halo con el color de la marca del proyecto, detrás de la pantalla.
              Va antes en el árbol y el marco es `relative`: así queda debajo
              sin recurrir a un z-index negativo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-8%] top-[-12%] bottom-[-10%] bg-[radial-gradient(60%_55%_at_50%_45%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_70%)]"
          />

          <SharedElement name={`portada-${project.slug}`}>
            <div className="screen relative">
              <Lens zoomFactor={1.7} lensSize={240}>
                <Image
                  src={project.cover.src}
                  alt={project.cover.alt}
                  width={project.cover.width}
                  height={project.cover.height}
                  sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 56vw, 800px"
                  className="h-auto w-full"
                />
              </Lens>
            </div>
          </SharedElement>

          <ShineBorder
            borderWidth={1.5}
            duration={12}
            shineColor={["var(--color-jade)", "var(--accent)"]}
          />
        </div>
      </Reveal>

      <div className="col-span-12 lg:col-span-4 lg:col-start-9">
        <Reveal delay={0.08}>
          <p className="text-paper-faint text-micro font-mono">
            {project.client ? `${project.kind}, ${project.client}` : project.kind}
          </p>

          {/* Un escalón debajo del título de la sección y uno arriba de las
              tarjetas: la portada es lo que tiene que pesar acá. */}
          <h3 id={`destacado-${project.slug}`} className="text-h3 mt-4">
            <SharedElement name={`titulo-${project.slug}`}>
              <span className="inline-block">{project.name}</span>
            </SharedElement>
          </h3>

          <p className="text-paper-muted text-lead mt-5">{project.tagline}</p>

          {/* Sin `.meta`: el rótulo de la sección ya es el único de este bloque. */}
          {stack.length > 0 ? (
            <ul
              aria-label="Stack"
              className="text-paper-faint text-micro mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono"
            >
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10">
            <ActionLink href={`/proyectos/${project.slug}`}>Ver el caso</ActionLink>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
