import { Reveal } from "@/components/primitives/reveal";
import { ThreeDMarquee, type WallImage } from "@/components/ui/3d-marquee";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * El muro: todas las capturas de todos los proyectos, a sangre, cerrando la
 * sección de proyectos de la home. En escritorio y tablet es la grilla 3D que
 * deriva sola con el titular apoyado encima, sobre un velo; en el teléfono,
 * donde esa grilla dejaba medio contenedor en negro, `ThreeDMarquee` pasa a
 * dos columnas verticales que derivan en sentidos opuestos. La rama la decide
 * el componente por ancho de ventana.
 *
 * Debajo de `md` el titular va arriba del muro y no encima. Superpuesto, el
 * velo que hacía legible el texto sobre columnas de capturas claras tenía que
 * cubrir más de la mitad de un contenedor alto y angosto, y el muro volvía a
 * verse medio negro; apilados, el muro queda entero y el titular se lee sobre
 * noche. El orden lo da `flex` con `order` solo en ese ancho: el HTML y lo que
 * se ve en escritorio no cambian.
 *
 * Es decorativo a propósito: cada una de estas imágenes ya está en otra parte
 * del sitio con su `alt` real, así que el muro va con `aria-hidden` y el
 * titular con el aviso quedan afuera de él, legibles para todos.
 */

/**
 * Todas las imágenes de un proyecto, sin repetir: portada, áreas y galería.
 * Van con su tamaño real porque el muro del teléfono distingue las capturas
 * verticales (pantallas de celular) para no recortarlas a una franja.
 */
function projectImages(project: Project): WallImage[] {
  const all = [project.cover, ...project.areas.map((area) => area.shot), ...project.gallery];
  const seen = new Set<string>();

  return all.flatMap((shot) => {
    if (seen.has(shot.src)) return [];
    seen.add(shot.src);
    return [{ src: shot.src, width: shot.width, height: shot.height }];
  });
}

/**
 * Intercala las listas de a una imagen por proyecto. Con las listas una tras
 * otra cada columna del muro mostraba un solo producto; así se mezclan.
 */
function interleave(lists: WallImage[][]): WallImage[] {
  const longest = Math.max(0, ...lists.map((list) => list.length));
  const merged: WallImage[] = [];
  const seen = new Set<string>();
  for (let position = 0; position < longest; position += 1) {
    for (const list of lists) {
      const image = list[position];
      if (image !== undefined && !seen.has(image.src)) {
        seen.add(image.src);
        merged.push(image);
      }
    }
  }
  return merged;
}

export function ProjectsWall({ className }: { className?: string }) {
  const images = interleave(projects.map(projectImages));

  // La línea de abajo solo se afirma si es cierta para todos: que cada caso
  // trae su propio aviso sobre los datos que se ven en las capturas.
  const conAviso = projects.every((project) => Boolean(project.shotsDisclaimer));

  if (images.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-night-950 noise relative overflow-hidden max-md:flex max-md:flex-col",
        className,
      )}
    >
      <div aria-hidden="true" className="relative h-[70vh] min-h-[26rem]">
        <ThreeDMarquee images={images} className="h-full" />

        {/* Velos hacia la noche, arriba y abajo: el muro entra y sale del fondo
            en vez de cortarse, y el titular tiene dónde apoyarse. En el
            teléfono no hay titular encima y el muro plano ya trae su propio
            desvanecido en las puntas, así que no van: taparían columnas. */}
        <div className="bg-linear-to-b from-night-950 pointer-events-none absolute inset-x-0 top-0 h-32 to-transparent max-md:hidden" />
        <div className="bg-linear-to-t from-night-950 via-night-950/70 pointer-events-none absolute inset-x-0 bottom-0 h-1/2 to-transparent max-md:hidden" />
      </div>

      {/* En el teléfono deja de flotar: pasa al flujo, primero en el orden, con
          su propio aire arriba y un poco menos abajo, donde empieza el muro. */}
      <div className="shell pointer-events-none absolute inset-x-0 bottom-0 pb-[var(--spacing-section-sm)] max-md:static max-md:order-first max-md:pt-[var(--spacing-section-sm)] max-md:pb-10 max-md:pointer-events-auto">
        <Reveal threshold="loose">
          <h3 className="text-h2 max-w-[16ch]">Todas las pantallas, juntas.</h3>
          {conAviso ? (
            <p className="text-paper-muted text-micro mt-5 max-w-[44ch] font-mono">
              Cada caso de estudio aclara qué datos muestran sus capturas.
            </p>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}
