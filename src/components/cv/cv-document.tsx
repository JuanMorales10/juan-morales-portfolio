import { PrintButton } from "@/components/cv/print-button";
import { DirectionalLink } from "@/components/primitives/actions";
import { PendingNote } from "@/components/primitives/pending-note";
import { RevealGroup, RevealItem } from "@/components/primitives/reveal";
import { capabilities } from "@/content/capabilities";
import { credentials, roles } from "@/content/experience";
import { hero, intro } from "@/content/profile";
import { getProject } from "@/content/projects";
import { contactLinks, realValue, site } from "@/content/site";

/**
 * El CV, en pantalla y en papel, desde el mismo contenido.
 *
 * En pantalla no es la foto de una hoja A4: es una página del sitio, sobre
 * noche, con una columna de lectura y la ficha de contacto al costado. El salto
 * al papel lo hace el bloque `@media print` de globals.css (blanco y negro);
 * acá se corrigen las cosas que ese bloque no puede saber: la escala
 * tipográfica es fluida en `vw` y en A4 se dispara, el ritmo vertical del sitio
 * sobra en una hoja, y cada texto que lleva un color de papel explícito tiene
 * que volver a negro con `print:text-black`, porque el `color` del `body` no le
 * gana a una clase puesta sobre el elemento.
 *
 * Lo único que se mueve es el encabezado, y se mueve porque está arriba de
 * todo: `whileInView` deja en opacidad cero lo que nunca entró al viewport, y
 * eso en papel sale en blanco. Cualquier bloque que alguien pueda no haber
 * visto todavía cuando aprieta Ctrl+P va estático, la ficha de contacto la
 * primera: es el dato que no puede faltar en el PDF.
 *
 * Nada de esto usa fondos: al imprimir, los navegadores descartan
 * `background-color` salvo que la persona tilde "gráficos de fondo", pero
 * respetan los bordes. Por eso las reglas y los marcadores son `border`.
 */

/** Título de sección. En papel baja a un cuerpo que no roba media hoja. */
const sectionTitle = "text-h3 text-paper print:text-[12.5pt] print:text-black";

/** Texto secundario: papel apagado en pantalla, negro en la hoja. */
const muted = "text-paper-muted print:text-black";

/** Fechas y rótulos de ficha: monoespaciada, sin llegar a ser otra `.meta`. */
const metaLine = "font-mono text-micro text-paper-faint print:text-[8.5pt] print:text-[#444444]";

/**
 * Párrafo de lectura: medida corta en pantalla, ancho completo y negro en papel.
 * Va el valor de `.measure` escrito a mano y no la clase, porque `.measure` se
 * declara después de las utilidades generadas y le ganaría a `print:max-w-none`:
 * el texto saldría angosto en la hoja, con media pulgada muerta a la derecha.
 */
const prose = "max-w-[34rem] print:max-w-none print:text-black";

/** Enlace de la ficha: papel apagado que sube a papel al pasar; negro en papel. */
const contactLink = "text-paper-muted hover:text-paper print:text-black";

/** El enlace muestra el nombre; en papel se imprime el dominio al lado. */
function printableUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/**
 * URL del caso de estudio para la versión papel. Mientras el dominio siga
 * siendo el de reserva no se imprime nada: en pantalla el enlace navega igual,
 * pero una URL que puede no resolver es, en una hoja, un dato falso.
 */
function caseStudyPrintUrl(slug: string): string | undefined {
  if (site.urlIsProvisional) return undefined;
  return `${printableUrl(site.url)}/proyectos/${slug}`;
}

export function CvDocument() {
  const email = realValue(site.email);
  const github = realValue(site.github);

  return (
    <div className="shell print:max-w-none print:px-0">
      {/* El ritmo vertical va sin variantes de ancho. En papel el ancho útil de
          una A4 con los márgenes de `@page` cae cerca de los breakpoints, así
          que apilar `md:` y `print:` sobre la misma propiedad deja el resultado
          atado a cuál de las dos variantes se generó última. Un solo valor de
          pantalla y un `print:` explícito no dependen de ese orden. */}
      <div className="grid12 gap-y-14 pt-28 pb-24 print:gap-y-4 print:pt-0 print:pb-0">
        <header className="col-span-12">
          <div
            data-print="hide"
            className="hairline-b flex flex-wrap items-start justify-between gap-x-8 gap-y-6 pb-6"
          >
            <p className="pt-1">
              <DirectionalLink href="/" className="text-paper-muted hover:text-paper">
                Volver al portfolio
              </DirectionalLink>
            </p>
            <PrintButton />
          </div>

          <RevealGroup className="mt-12 print:mt-0" stagger={0.07}>
            <RevealItem as="p" className="meta print:text-[#444444]">
              Curriculum vitae
            </RevealItem>
            <RevealItem
              as="h1"
              className="text-h1 text-paper mt-6 print:mt-1 print:text-[22pt] print:text-black"
            >
              {site.name}
            </RevealItem>
            <RevealItem
              as="p"
              className={`text-lead mt-6 max-w-[46rem] print:mt-1 print:max-w-none print:text-[10.5pt] ${muted}`}
            >
              {hero.titlePlain}
            </RevealItem>
          </RevealGroup>
        </header>

        <aside
          aria-labelledby="cv-contacto"
          className="print-avoid-break col-span-12 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:sticky lg:top-28 lg:self-start print:col-span-12 print:col-start-auto print:row-start-auto"
        >
          {/* Sin reveal: en `lg` esta ficha arranca en la segunda fila y en una
              ventana baja puede no haber entrado nunca al viewport cuando
              alguien manda a imprimir. Un CV sin datos de contacto no es un CV. */}
          <h2 id="cv-contacto" className="meta print:text-[#444444]">
            Contacto
          </h2>

          <dl className="mt-5 print:mt-2 print:grid print:grid-cols-3 print:gap-x-8">
            <div className="hairline-t py-3 print:pt-1 print:pb-0">
              <dt className={metaLine}>Rol</dt>
              <dd className="text-paper mt-1 print:text-black">{site.role}</dd>
            </div>
            <div className="hairline-t py-3 print:pt-1 print:pb-0">
              <dt className={metaLine}>Ubicación</dt>
              <dd className="text-paper mt-1 print:text-black">{site.location}</dd>
            </div>
            <div className="hairline-t py-3 print:pt-1 print:pb-0">
              <dt className={metaLine}>Enlaces</dt>
              <dd className="mt-1 flex flex-col items-start gap-1.5">
                {contactLinks.map((link) => (
                  <DirectionalLink
                    key={link.href}
                    href={link.href}
                    external
                    printUrl={link.printAs}
                    className={contactLink}
                  >
                    {link.label}
                  </DirectionalLink>
                ))}

                {/* La cuenta de GitHub es real: se muestra y su dirección se
                    imprime al lado, como el resto de los enlaces. */}
                {github ? (
                  <DirectionalLink
                    href={github}
                    external
                    printUrl={printableUrl(github)}
                    className={contactLink}
                  >
                    GitHub
                  </DirectionalLink>
                ) : (
                  <span data-print="hide">
                    <PendingNote>GitHub</PendingNote>
                  </span>
                )}

                {email ? (
                  <DirectionalLink href={`mailto:${email}`} className={contactLink}>
                    {email}
                  </DirectionalLink>
                ) : (
                  <span data-print="hide">
                    <PendingNote>Correo personal de contacto</PendingNote>
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="col-span-12 lg:col-span-7 lg:col-start-1 lg:row-start-2 print:col-span-12 print:col-start-auto print:row-start-auto">
          <section aria-labelledby="cv-perfil">
            <h2 id="cv-perfil" className={sectionTitle}>
              Perfil
            </h2>
            <p className={`text-lead text-paper mt-6 print:mt-2 print:text-[10.5pt] ${prose}`}>
              {intro.lead}
            </p>
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className={`mt-4 print:mt-2 ${muted} ${prose}`}>
                {paragraph}
              </p>
            ))}
          </section>

          <section aria-labelledby="cv-experiencia" className="mt-16 print:mt-6">
            <h2 id="cv-experiencia" className={sectionTitle}>
              Experiencia
            </h2>

            <div className="mt-8 flex flex-col gap-10 print:mt-3 print:gap-4">
              {roles.map((role) => {
                const caseStudy = role.project ? getProject(role.project) : undefined;

                return (
                  <article
                    key={role.id}
                    className="print-avoid-break hairline-t pt-6 print:pt-2"
                  >
                    <p className={metaLine}>{role.period}</p>
                    <h3 className="text-h4 text-paper mt-2 print:mt-1 print:text-[11pt] print:text-black">
                      {role.title}
                    </h3>
                    <p className={`mt-1 ${muted}`}>
                      {role.companyUrl ? (
                        <DirectionalLink
                          href={role.companyUrl}
                          external
                          printUrl={printableUrl(role.companyUrl)}
                          className="hover:text-paper"
                        >
                          {role.company}
                        </DirectionalLink>
                      ) : (
                        role.company
                      )}
                    </p>

                    <p className={`mt-4 print:mt-2 ${muted} ${prose}`}>{role.summary}</p>

                    <ul className="mt-4 flex flex-col gap-2 print:mt-2 print:gap-1">
                      {role.responsibilities.map((item) => (
                        <li key={item} className={`flex gap-3 ${muted}`}>
                          {/* Un aro y no un relleno: el marcador tiene que
                              sobrevivir a una impresión sin gráficos de fondo, o
                              la lista sale sangrada y sin viñeta. Circular y no
                              una raya, porque una raya al principio de cada
                              renglón se lee como un guión largo. */}
                          <span
                            aria-hidden="true"
                            className="mt-[0.62em] size-[5px] shrink-0 self-start rounded-full border border-[var(--hairline-strong)]"
                          />
                          <span className={prose}>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {caseStudy ? (
                      <p className="mt-5 print:mt-2">
                        <DirectionalLink
                          href={`/proyectos/${caseStudy.slug}`}
                          printUrl={caseStudyPrintUrl(caseStudy.slug)}
                          className="text-jade hover:text-jade-glow text-[0.9375rem] font-medium print:text-black"
                        >
                          Ver el caso de estudio de {caseStudy.name}
                        </DirectionalLink>
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="cv-formacion" className="mt-16 print:mt-6">
            <h2 id="cv-formacion" className={sectionTitle}>
              Formación
            </h2>

            <div className="mt-8 flex flex-col print:mt-3">
              {credentials.map((credential) => (
                <article
                  key={credential.id}
                  className="print-avoid-break hairline-t py-6 last:pb-0 print:py-2"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-h4 text-paper print:text-[11pt] print:text-black">
                      {credential.program}
                    </h3>
                    <p className={metaLine}>{credential.period}</p>
                  </div>
                  <p className={`mt-1 ${muted}`}>{credential.institution}</p>
                  <p className={`mt-3 print:mt-1 ${muted} ${prose}`}>
                    {credential.details.join(" ")}
                  </p>
                  {credential.note ? (
                    <p className="text-paper-faint text-micro mt-3 max-w-[34rem] print:mt-1 print:max-w-none print:text-[#444444]">
                      {credential.note}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="cv-capacidades" className="mt-16 print:mt-6">
            <h2 id="cv-capacidades" className={sectionTitle}>
              Capacidades
            </h2>

            <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 print:mt-3 print:grid-cols-2 print:gap-y-3">
              {capabilities.map((group) => (
                <div key={group.id} className="print-avoid-break">
                  <h3 className="text-h4 text-paper print:text-[11pt] print:text-black">
                    {group.title}
                  </h3>
                  <p className="text-paper-faint text-micro mt-1 print:text-[#444444]">
                    {group.intro}
                  </p>
                  <p className="text-paper mt-3 print:mt-1 print:text-black">
                    {group.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
