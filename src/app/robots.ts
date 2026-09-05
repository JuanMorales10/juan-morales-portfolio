import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/**
 * No hay nada que esconder: los borradores ni siquiera se sirven, así que no
 * hace falta un `disallow`. El sitemap se apunta con la URL absoluta porque es
 * lo único que aceptan los rastreadores.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
