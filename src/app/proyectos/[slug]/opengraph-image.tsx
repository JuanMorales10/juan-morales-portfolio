import { ImageResponse } from "next/og";

import { getProject, publishedProjects } from "@/content/projects";
import { site } from "@/content/site";

/**
 * Tarjeta social de un caso de estudio. Mismo sistema que la de la home, sobre
 * noche, con el nombre del proyecto y su tagline: no se dibuja la captura
 * porque una imagen de producto reescalada a 1200 x 630 se lee peor que el
 * texto.
 *
 * Sobre la tipografía y los colores escritos a mano, ver `app/opengraph-image.tsx`.
 *
 * `alt` tiene que ser una constante del módulo, así que describe la pieza en
 * general; el nombre del proyecto ya viaja en el `og:title` de la página.
 */

export const alt = `Caso de estudio en el portfolio de ${site.name}.`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/** Se prerenderiza una tarjeta por caso publicado. Los borradores no entran. */
export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  const title = project ? project.name : site.name;
  const line = project ? project.tagline : site.role;
  const stamp = project ? project.kind : site.location;

  // El nombre tiene que entrar en un renglón: un segundo renglón a 128 px empuja
  // la tagline fuera de los 630 px y la tarjeta sale cortada. En el ancho útil
  // entran unos catorce caracteres a ese cuerpo, así que un nombre más largo
  // baja de tamaño en lugar de partirse.
  const titleSize = title.length > 22 ? 76 : title.length > 14 ? 100 : 128;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f110e",
          color: "#f2f3ee",
          padding: "76px 88px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2c29",
            paddingBottom: 30,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: "#a9aea3" }}>{site.name}</div>
          {/* Mismo rótulo que `.meta`: 0,1 em de tracking sobre 24 px. */}
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 2.4, color: "#7d827a" }}>
            {stamp.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              lineHeight: 1,
              letterSpacing: titleSize * -0.045,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", width: 96, height: 6, marginTop: 34, backgroundColor: "#4fd1b3" }} />
          <div
            style={{
              display: "flex",
              marginTop: 34,
              maxWidth: 880,
              fontSize: 42,
              lineHeight: 1.3,
              letterSpacing: -0.5,
              color: "#a9aea3",
            }}
          >
            {line}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
