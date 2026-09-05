import Link from "next/link";

import { DirectionalLink } from "@/components/primitives/actions";
import { PendingNote } from "@/components/primitives/pending-note";
import { realValue, site } from "@/content/site";

/** `https://www.linkedin.com/in/x/` se imprime como `linkedin.com/in/x`, igual que los `printAs` del contenido. */
function printable(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/**
 * Footer en noche, con una hairline que lo separa del contacto. Los datos que
 * Juan todavía no entregó no aparecen: en su lugar queda un recordatorio que
 * solo se ve en desarrollo.
 */
export function SiteFooter() {
  const email = realValue(site.email);
  const github = realValue(site.github);
  const year = new Date().getFullYear();

  return (
    <footer data-print="hide" className="bg-night-900 text-paper hairline-t">
      <div className="shell flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <div>
          <p className="text-h4 tracking-[-0.012em]">{site.name}</p>
          <p className="text-paper-muted mt-1 text-[0.9375rem]">
            {site.role}. {site.location}.
          </p>
        </div>

        <nav aria-label="Enlaces de contacto">
          <ul className="text-paper-muted flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.9375rem]">
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
                Rienda
              </DirectionalLink>
            </li>
            {email ? (
              <li>
                <DirectionalLink href={`mailto:${email}`} className="hover:text-paper">
                  {email}
                </DirectionalLink>
              </li>
            ) : (
              <li>
                <PendingNote>Correo de contacto</PendingNote>
              </li>
            )}
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
            <li>
              <Link
                href="/cv"
                className="link-underline transition-colors duration-300 hover:text-paper"
              >
                CV
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="shell hairline-t py-6">
        <p className="meta">
          {year} · Sitio propio, hecho con Next.js · Schibsted Grotesk y JetBrains Mono
        </p>
      </div>
    </footer>
  );
}
