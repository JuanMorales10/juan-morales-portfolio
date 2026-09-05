import Image from "next/image";

import { ActionLink } from "@/components/primitives/actions";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Header, HeroParallax, type ParallaxProduct } from "@/components/ui/hero-parallax";
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { hero } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import type { Project, Shot } from "@/content/types";

/** Capturas por proyecto en la escena. Cinco proyectos por tres son las quince filas del parallax. */
const SHOTS_PER_PROJECT = 3;

/**
 * Capturas apaisadas y sin repetir de un proyecto, en el orden en que el
 * contenido las presenta: portada, áreas, galería. Las verticales (teléfono)
 * quedan afuera porque el marco de la tarjeta es 16:10 y las cortaría.
 */
function landscapeShots(project: Project): Shot[] {
  const seen = new Set<string>();
  const all = [project.cover, ...project.areas.map((area) => area.shot), ...project.gallery];

  return all.filter((shot) => {
    if (seen.has(shot.src) || shot.width <= shot.height) return false;
    seen.add(shot.src);
    return true;
  });
}

/**
 * Se intercalan por proyecto: la primera fila lleva las portadas de los cinco,
 * la segunda su segunda pantalla, la tercera la tercera. Así cada fila mezcla
 * todos los proyectos y ningún color de marca se amontona.
 */
function buildProducts(list: Project[]): ParallaxProduct[] {
  const perProject = list.map((project) => ({
    project,
    shots: landscapeShots(project).slice(0, SHOTS_PER_PROJECT),
  }));

  const products: ParallaxProduct[] = [];
  for (let index = 0; index < SHOTS_PER_PROJECT; index += 1) {
    for (const { project, shots } of perProject) {
      const shot = shots[index];
      if (!shot) continue;
      products.push({
        title: project.name,
        link: `/proyectos/${project.slug}`,
        thumbnail: shot.src,
        width: shot.width,
        height: shot.height,
        accent: project.accent,
      });
    }
  }
  return products;
}

/**
 * Hero.
 *
 * Lo primero que ve una empresa. El titular, la bajada y los dos botones
 * entran en la primera pantalla de una portátil de 900 px; la escena de
 * capturas asoma inclinada por debajo y se endereza al bajar. El `Spotlight`
 * barre detrás en jade y la trama de puntos apenas se ve: son textura, no
 * protagonistas. Las capturas sí lo son.
 *
 * En el teléfono, donde va a entrar la mayoría desde LinkedIn, la escena son
 * dos columnas de capturas que derivan solas (lo resuelve `HeroParallax`
 * debajo de `md`). El encabezado es el mismo en todos los anchos.
 *
 * El retrato disponible es una copia de LinkedIn de 400 x 400: se usa chico,
 * donde todavía se ve nítido en pantallas de alta densidad.
 */
export function Hero() {
  const products = buildProducts(projects);
  const glowLine = hero.titleLines.length - 1;

  return (
    <section aria-labelledby="hero-titulo" className="bg-night-900 relative overflow-hidden">
      <DotPattern
        width={28}
        height={28}
        cx={1}
        cy={1}
        cr={1.1}
        glow
        className="h-[100svh] opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]"
      />
      {/* Escritorio: los haces por defecto. Debajo de `md` van más angostos y
          menos altos: con 560 px de ancho sobre una pantalla de 390 los dos se
          fundían en un velo parejo, y el barrido de 100 px era un cuarto del
          ancho. Así siguen leyéndose como dos luces que bajan de las esquinas
          y se cruzan detrás del titular. */}
      <Spotlight className="hidden md:block" />
      <Spotlight
        className="md:hidden"
        width={340}
        height={1100}
        smallWidth={160}
        translateY={-150}
        xOffset={48}
      />

      <HeroParallax
        products={products}
        header={
          <Header className="pt-24 md:pt-28">
            <BlurFade>
              {/* El único `.meta` de la sección: los dos rótulos lo heredan. */}
              <p className="meta hairline-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-4">
                <span>{hero.status}</span>
                <span>{hero.location}</span>
              </p>
            </BlurFade>

            <h1 id="hero-titulo" className="text-display mt-8 font-medium md:mt-10">
              <TextGenerateEffect words={hero.titleLines} glow={glowLine} />
            </h1>

            <div className="grid12 mt-8 items-end gap-y-8 md:mt-10">
              <div className="col-span-12 flex flex-col gap-6 md:col-span-8 lg:col-span-7">
                <BlurFade delay={0.55}>
                  <p className="text-lead text-paper-muted measure-wide">{hero.description}</p>
                </BlurFade>

                <BlurFade delay={0.7}>
                  <div className="flex flex-wrap items-center gap-3">
                    <ActionLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ActionLink>
                    <ActionLink href={hero.secondaryCta.href} variant="secondary">
                      {hero.secondaryCta.label}
                    </ActionLink>
                  </div>
                </BlurFade>
              </div>

              <BlurFade
                delay={0.85}
                className="col-span-12 md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10"
              >
                <figure className="flex items-center gap-4 md:flex-col md:items-end md:gap-3">
                  <div className="screen h-20 w-20 shrink-0 md:h-32 md:w-32">
                    <Image
                      src={hero.portrait.src}
                      alt={hero.portrait.alt}
                      width={hero.portrait.width}
                      height={hero.portrait.height}
                      sizes="(max-width: 768px) 80px, 128px"
                      priority
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="text-paper-faint text-micro">{site.name}</figcaption>
                </figure>
              </BlurFade>
            </div>
          </Header>
        }
      />
    </section>
  );
}
