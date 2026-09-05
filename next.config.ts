import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las capturas de Rienda son PNG de 2880 de ancho. Servirlas en AVIF baja
    // el peso lo suficiente como para que la escena con scroll no dependa de la
    // conexión.
    formats: ["image/avif", "image/webp"],
    // Anchos reales que pide el sitio, para no generar variantes que nadie usa.
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [160, 268, 360, 480],
  },
  // El header lo agrega la plataforma de hosting en la mayoría de los casos, pero
  // dejarlo acá hace que el sitio se comporte igual en `next start` local.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
