import { ImageResponse } from "next/og";

import { site } from "@/content/site";

/**
 * Tarjeta social de la home.
 *
 * Repite la composición del hero sobre noche: una hairline arriba con la
 * metadata, el nombre grande abajo en papel y un solo trazo jade. `ImageResponse`
 * no tiene las fuentes del sitio (Satori solo usa las que se le pasan, no las
 * del sistema) y cargar Schibsted a mano obligaría a versionar un `.ttf` solo
 * para esto, así que se usa la tipográfica que trae por defecto: el peso lo dan
 * el tamaño y el color, no la familia. Los colores están escritos a mano porque
 * Satori no lee las variables de `globals.css`: son night-900, paper,
 * paper-muted, paper-faint, jade-glow y `#2a2c29`, que es la hairline del
 * sistema ya resuelta sobre la noche, porque acá tampoco hay `color-mix`.
 */

export const alt = `${site.name}. ${site.role}. ${site.location}.`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function Image() {
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
          <div style={{ display: "flex", width: 96, height: 6, backgroundColor: "#4fd1b3" }} />
          {/* Mismo rótulo que `.meta`: 0,1 em de tracking sobre 24 px. */}
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 2.4, color: "#7d827a" }}>
            {site.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, lineHeight: 1, letterSpacing: -6 }}>
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 42,
              lineHeight: 1.25,
              letterSpacing: -0.5,
              color: "#a9aea3",
            }}
          >
            {site.role}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
