import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseBlocks } from "@/components/case-study/case-blocks";
import { CaseGallery } from "@/components/case-study/case-gallery";
import { CaseHero, accentStyle } from "@/components/case-study/case-hero";
import { ActionLink, DirectionalLink } from "@/components/primitives/actions";
import { Reveal } from "@/components/primitives/reveal";
import { SharedElement } from "@/components/primitives/shared-element";
import { getProject, publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import type { Project } from "@/content/types";
import { projectJsonLd } from "@/lib/seo";

type CaseParams = { slug: string };

/** Solo lo publicado se prerenderiza: un borrador no existe para el build. */
export function generateStaticParams(): CaseParams[] {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CaseParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  // Sin proyecto la página termina en 404, así que no hay metadata que dar.
  if (!project) return {};

  const path = `/proyectos/${project.slug}`;

  return {
    title: project.seo.title,
    description: project.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "es_AR",
      url: `${site.url}${path}`,
      siteName: site.name,
      title: project.seo.title,
      description: project.seo.description,
      // Sin `images`: la tarjeta la genera `opengraph-image.tsx` de este mismo
      // segmento, y la metadata por archivo pisa a la del objeto.
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo.title,
      description: project.seo.description,
    },
  };
}

/**
 * El caso que sigue en el índice publicado, para no dejar la página en un
 * callejón. Con un solo proyecto publicado no hay siguiente.
 */
function nextProject(current: Project): Project | undefined {
  if (publishedProjects.length < 2) return undefined;
  const index = publishedProjects.findIndex((project) => project.slug === current.slug);
  return publishedProjects[(index + 1) % publishedProjects.length];
}

/**
 * Caso de estudio.
 *
 * `getProject` ya filtra los borradores en producción, así que un proyecto sin
 * publicar cae en `notFound` en el sitio publicado y sigue siendo visible
 * mientras se escribe en local.
 */
export default async function CaseStudyPage({ params }: { params: Promise<CaseParams> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const jsonLd = projectJsonLd({
    name: project.name,
    description: project.seo.description,
    url: `${site.url}/proyectos/${project.slug}`,
    image: project.cover.src,
    slug: project.slug,
  });

  const [primaryLink] = project.links;
  const next = nextProject(project);

  return (
    // `--accent` baja por herencia hasta el velo detrás de la portada. Es el
    // único uso del color de la marca del proyecto en la página.
    <main id="contenido" style={accentStyle(project.accent)}>
      <script
        type="application/ld+json"
        // Se arma desde el contenido tipado, igual que el JSON-LD de Person.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CaseHero project={project} />

      <CaseBlocks blocks={project.blocks} areas={project.areas} />

      {project.gallery.length > 0 ? (
        <section
          id="galeria"
          aria-labelledby="galeria-titulo"
          className="pb-[var(--spacing-section)]"
        >
          <div className="shell">
            {/* Misma columna que los encabezados de los bloques: todo lo que
                viene después del nombre del proyecto cuelga del mismo margen. */}
            <Reveal className="grid12">
              <h2 id="galeria-titulo" className="text-h3 text-paper col-span-12 lg:col-span-3">
                Otras piezas
              </h2>
            </Reveal>

            <div className="mt-12 md:mt-16">
              <CaseGallery shots={project.gallery} />
            </div>
          </div>
        </section>
      ) : null}

      <section aria-label="Seguir navegando" className="hairline-t py-[var(--spacing-section-sm)]">
        <div className="shell">
          <div className="grid12 items-baseline gap-y-8">
            <Reveal as="p" className="col-span-12 md:col-span-6">
              {/* Al índice, no al ancla de la home: es la página hermana de este
                  caso y la portada vuelve al mismo lugar del que salió. */}
              <DirectionalLink href="/proyectos" className="text-h4 text-paper hover:text-jade">
                Volver a proyectos
              </DirectionalLink>
            </Reveal>

            {primaryLink ? (
              <Reveal
                delay={0.06}
                className="col-span-12 md:col-span-5 md:col-start-8 md:text-right"
              >
                <ActionLink href={primaryLink.href} external variant="secondary">
                  {primaryLink.label}
                </ActionLink>
              </Reveal>
            ) : null}
          </div>

          {next ? (
            <Reveal delay={0.1} className="mt-[var(--spacing-section-sm)]">
              <Link
                href={`/proyectos/${next.slug}`}
                aria-label={`Siguiente caso: ${next.name}`}
                style={accentStyle(next.accent)}
                className="group grid12 items-center gap-y-8 rounded-[var(--radius-lg)]"
              >
                <div className="col-span-12 lg:col-span-5">
                  <p className="meta">Siguiente caso</p>
                  <p className="text-h2 group-hover:text-jade mt-6 transition-colors duration-300">
                    {next.name}
                  </p>
                  <p className="text-body text-paper-muted measure mt-4">{next.tagline}</p>
                </div>

                {/* Mismo `name` que la portada de su propio caso: al pasar, esta
                    miniatura se convierte en la pantalla grande de la página
                    siguiente en lugar de cortar. */}
                <SharedElement name={`portada-${next.slug}`}>
                  <div
                    className="screen relative col-span-12 aspect-[16/10] lg:col-span-6 lg:col-start-7"
                    style={{
                      boxShadow:
                        "var(--shadow-screen), 0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent)",
                    }}
                  >
                    <Image
                      src={next.cover.src}
                      alt={next.cover.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 50vw, 752px"
                      className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.02]"
                    />
                  </div>
                </SharedElement>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>
    </main>
  );
}
