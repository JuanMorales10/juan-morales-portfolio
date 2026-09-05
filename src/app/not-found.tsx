import { ActionLink } from "@/components/primitives/actions";
import { Reveal } from "@/components/primitives/reveal";
import { SectionLabel } from "@/components/primitives/section";

/**
 * 404.
 *
 * Ocupa la pantalla entera porque no hay nada más abajo, y usa el mismo
 * lenguaje que el hero: hairline, rótulo en mono, el título en el cuerpo más
 * grande del sitio y las dos salidas como botones, con un velo jade detrás.
 * No lleva ilustración ni chiste: alguien llegó a una dirección que no existe
 * y lo único útil es devolverlo al sitio.
 */
export default function NotFound() {
  return (
    <main
      id="contenido"
      className="relative flex flex-1 flex-col justify-center overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <div className="halo" aria-hidden="true" />

      <div className="shell relative">
        <div className="grid12 gap-y-10">
          <div className="col-span-12 lg:col-span-9">
            <Reveal>
              <SectionLabel className="w-fit">Error 404</SectionLabel>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="text-display mt-10 max-w-[11ch]">
                Esta página <span className="text-glow">no existe</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-lead text-paper-muted measure mt-8">
                Puede que el enlace haya quedado viejo o que la dirección tenga
                un error. Desde acá se llega al resto del sitio.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-12 flex flex-wrap items-center gap-3">
                <ActionLink href="/">Volver al inicio</ActionLink>
                <ActionLink href="/proyectos" variant="secondary">
                  Ver los proyectos
                </ActionLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}
