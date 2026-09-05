import type { MetadataRoute } from "next";

import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Mapa del sitio.
 *
 * Se arma desde `publishedProjects`, nunca desde `projects`: los borradores no
 * se indexan, así se puede escribir un caso nuevo con el sitio en producción.
 * `lastModified` toma la fecha del build, que es cuando el contenido cambia de
 * verdad, porque el contenido es código.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/proyectos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/cv`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...publishedProjects.map((project) => ({
      url: `${site.url}/proyectos/${project.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.9,
    })),
  ];
}
