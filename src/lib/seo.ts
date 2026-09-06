import { capabilities } from "@/content/capabilities";
import { credentials, publishedRoles } from "@/content/experience";
import { realValue, site } from "@/content/site";

/**
 * JSON-LD de tipo Person, generado desde el contenido tipado.
 *
 * Solo entra lo verificable. Los datos pendientes (correo, GitHub) se filtran
 * con `realValue`, así el marcado estructurado nunca publica un marcador.
 */
export function personJsonLd() {
  const email = realValue(site.email);
  const github = realValue(site.github);

  const sameAs = [site.linkedin, site.rienda, github].filter(
    (value): value is string => Boolean(value),
  );

  const currentRole = publishedRoles.find((role) => role.end === null);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#persona`,
    name: site.name,
    url: site.url,
    jobTitle: currentRole ? currentRole.title : site.role,
    description: site.description,
    image: `${site.url}/perfil/juan-morales.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mendoza",
      addressCountry: "AR",
    },
    ...(email ? { email: `mailto:${email}` } : {}),
    sameAs,
    worksFor: publishedRoles
      .filter((role) => role.end === null)
      .map((role) => ({
        "@type": "Organization",
        name: role.company,
        ...(role.companyUrl ? { url: role.companyUrl } : {}),
      })),
    alumniOf: credentials.map((credential) => ({
      "@type": "EducationalOrganization",
      name: credential.institution,
    })),
    knowsAbout: capabilities.flatMap((group) => group.items),
  };
}

/** Marcado del caso de estudio, para que el proyecto se entienda como obra. */
export function projectJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${site.url}/proyectos/${input.slug}#obra`,
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image.startsWith("http") ? input.image : `${site.url}${input.image}`,
    inLanguage: site.languageTag,
    author: { "@id": `${site.url}/#persona` },
  };
}
