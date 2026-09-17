import { ActionLink, DirectionalLink } from "@/components/primitives/actions";
import { PendingNote } from "@/components/primitives/pending-note";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { realValue, site } from "@/content/site";

/** `https://www.linkedin.com/in/x/` se imprime como `linkedin.com/in/x`, igual que los `printAs` del contenido. */
function printable(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/**
 * Contacto: la última pantalla del sitio.
 *
 * Un halo jade quieto detrás, un titular a tamaño display y un solo botón. Los
 * haces animados y el borde en movimiento de antes tenían el hilo principal
 * ocupado casi todo el tiempo y el scroll del teléfono bajaba a 21 cuadros por
 * segundo, así que se fueron. Si el correo todavía no está cargado, el primario lleva
 * a LinkedIn en lugar de mostrar un enlace roto.
 *
 * En táctil el botón no tiene hover: el relleno de hover pasa también a
 * `active:` para que el toque responda, y debajo de `lg` el halo jade del
 * contenedor es más cercano y presente, porque `shadow-glow-sm` sobre un botón
 * de 48 px queda casi invisible. En escritorio nada de esto se ve.
 */
export function Contact() {
  const email = realValue(site.email);
  const github = realValue(site.github);

  const primary = email
    ? { href: `mailto:${email}`, label: email, external: false }
    : { href: site.linkedin, label: "Escribirme por LinkedIn", external: true };

  return (
    <Section
      id="contacto"
      surface="ink"
      labelledBy="contacto-titulo"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_20%_80%,color-mix(in_oklab,var(--color-jade)_16%,transparent),transparent)]"
      />

      <div className="grid12 relative z-10 gap-y-14">
        <div className="col-span-12 lg:col-span-9">
          <Reveal>
            <p className="meta">Contacto</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 id="contacto-titulo" className="text-display mt-8 max-w-[16ch]">
              Si estás construyendo algo difícil,{" "}
              <span className="text-glow">escribime</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-lead text-paper-muted measure-wide mt-10">
              Producto, arquitectura, desarrollo o cómo aplicar inteligencia
              artificial a una operación que ya existe. Contame el problema, no
              hace falta que traigas la solución.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href={primary.href}
                target={primary.external ? "_blank" : undefined}
                rel={primary.external ? "noopener noreferrer" : undefined}
                className="bg-paper text-night-900 hover:bg-jade-glow active:bg-jade-glow shadow-glow-sm inline-flex min-h-12 items-center rounded-full px-7 py-3.5 text-[0.9375rem] font-medium transition-colors duration-300"
              >
                {primary.label}
              </a>
              <ActionLink href="/cv" variant="secondary">
                Ver el CV
              </ActionLink>
            </div>
          </Reveal>

          {email ? null : (
            <div className="mt-6">
              <PendingNote>Correo personal de contacto</PendingNote>
            </div>
          )}
        </div>

        <RevealGroup className="col-span-12 flex flex-col gap-6 lg:col-span-3 lg:col-start-10 lg:pt-2">
          <RevealItem>
            <h3 className="text-h4 text-paper">Dónde encontrarme</h3>
          </RevealItem>
          <RevealItem as="ul" className="text-paper-muted flex flex-col gap-3 text-[0.9375rem]">
            <li>
              <DirectionalLink
                href={site.linkedin}
                external
                className="hover:text-paper"
                printUrl={printable(site.linkedin)}
              >
                LinkedIn
              </DirectionalLink>
            </li>
            <li>
              <DirectionalLink
                href={site.rienda}
                external
                className="hover:text-paper"
                printUrl={printable(site.rienda)}
              >
                rienda.ar
              </DirectionalLink>
            </li>
            {github ? (
              <li>
                <DirectionalLink
                  href={github}
                  external
                  className="hover:text-paper"
                  printUrl={printable(github)}
                >
                  GitHub
                </DirectionalLink>
              </li>
            ) : (
              <li>
                <PendingNote>GitHub</PendingNote>
              </li>
            )}
          </RevealItem>
          <RevealItem>
            <p className="text-paper-faint text-micro mt-2">{site.location}</p>
          </RevealItem>
        </RevealGroup>
      </div>
    </Section>
  );
}
