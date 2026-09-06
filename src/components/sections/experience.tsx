import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { DirectionalLink } from "@/components/primitives/actions";
import { Reveal } from "@/components/primitives/reveal";
import { ScrollParallax } from "@/components/primitives/scroll-parallax";
import { SectionLabel } from "@/components/primitives/section";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { employerLabel, publishedRoles } from "@/content/experience";
import { getProject } from "@/content/projects";
import { realValue } from "@/content/site";
import type { Project, Role } from "@/content/types";

/**
 * Recorrido profesional sobre el Timeline de Aceternity.
 *
 * El componente es cliente; los roles se resuelven acá, en el servidor, y le
 * llegan ya armados: el período como título y el resto como contenido. Si el
 * rol tiene un caso de estudio, su portada cierra la entrada en un marco chico
 * con el color del proyecto detrás, para que el recorrido remita a la prueba.
 *
 * Debajo de `lg` la portada flota con el scroll dentro de su marco
 * (`ScrollParallax`): en el teléfono no hay puntero que la levante al pasar,
 * así que el gesto de bajar hace ese trabajo. Son dos ramas por ancho (la
 * imagen quieta de escritorio y la que flota) en vez de anular el `transform`
 * de Motion con `!important`: en escritorio sigue quieta y responde al hover
 * como antes.
 */
export function Experience() {
  const entries: TimelineEntry[] = publishedRoles.map((role) => ({
    id: role.id,
    title: role.period,
    content: (
      <RoleContent role={role} project={role.project ? getProject(role.project) : undefined} />
    ),
  }));

  return (
    <section
      id="recorrido"
      aria-labelledby="recorrido-titulo"
      className="py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="grid12 gap-y-8">
          <Reveal className="col-span-12 md:col-span-3">
            <SectionLabel>Recorrido</SectionLabel>
          </Reveal>

          <Reveal delay={0.05} className="col-span-12 md:col-span-8 md:col-start-5">
            <h2 id="recorrido-titulo" className="text-h2 max-w-[18ch]">
              Dónde trabajo y de qué me hago cargo.
            </h2>
          </Reveal>
        </div>

        <div className="mt-8 md:mt-12">
          <Timeline data={entries} />
        </div>
      </div>
    </section>
  );
}

function RoleContent({ role, project }: { role: Role; project?: Project }) {
  const empresa = realValue(role.company);

  return (
    <div className="pb-6 md:pb-10">
      <h3 id={`rol-${role.id}`} className="text-h3">
        {empresa && role.companyUrl ? (
          <DirectionalLink href={role.companyUrl} external className="hover:text-jade">
            {empresa}
          </DirectionalLink>
        ) : (
          employerLabel(role)
        )}
      </h3>

      <p className="text-h4 text-paper-muted mt-1.5">{role.title}</p>

      <p className="text-lead text-paper-muted measure-wide mt-6">{role.summary}</p>

      <ul className="hairline-b measure-wide mt-8">
        {role.responsibilities.map((responsibility) => (
          <li key={responsibility} className="hairline-t text-body text-paper py-3">
            {responsibility}
          </li>
        ))}
      </ul>

      {project ? <ProjectCover project={project} /> : null}
    </div>
  );
}

type AccentStyle = CSSProperties & { "--accent": string };

/** La portada del caso asociado, chica, con el color del producto detrás. */
function ProjectCover({ project }: { project: Project }) {
  const style: AccentStyle = { "--accent": project.accent };

  return (
    <Link
      href={`/proyectos/${project.slug}`}
      style={style}
      className="group mt-10 block max-w-[30rem]"
    >
      <span className="relative block">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 block rounded-[var(--radius-xl)] opacity-80 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 72%)",
          }}
        />
        <span
          className="screen relative block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
          style={{
            boxShadow:
              "var(--shadow-screen), 0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent)",
          }}
        >
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="480px"
            className="hidden h-auto w-full lg:block"
          />

          {/* Rama móvil: la captura va un 18% más grande que el marco (`scale`
              sobre la imagen, que no cambia el layout ni se suma al
              desplazamiento) y flota ±12 px. Las portadas son 16:10: a 390 px
              el marco mide unos 254 x 159 px y a 360 px, 224 x 140 px, así que
              el 9% de sobrante por lado (14 y 13 px) cubre el recorrido y el
              fondo del `.screen` no asoma. Con un 14% faltaba un píxel. */}
          <ScrollParallax as="span" range={[-12, 12]} className="block lg:hidden">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(max-width: 768px) 80vw, 480px"
              className="h-auto w-full scale-[1.18]"
            />
          </ScrollParallax>
        </span>
      </span>

      <span className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-jade group-hover:text-jade-glow text-[0.9375rem] font-medium transition-colors duration-300">
          Ver el caso de {project.name}
        </span>
        <span className="text-paper-faint text-micro font-mono">{project.kind}</span>
      </span>
    </Link>
  );
}
