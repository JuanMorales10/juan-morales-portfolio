import type { CapabilityGroup } from "./types";

/**
 * Cuatro grupos, no una nube de etiquetas. Cada grupo dice para qué sirve
 * antes de enumerar, porque una lista sin contexto no informa nada.
 */
export const capabilities: CapabilityGroup[] = [
  {
    id: "producto",
    title: "Producto",
    intro: "Decidir qué construir y en qué orden, con el negocio del cliente adelante.",
    items: [
      "Estrategia de producto",
      "Investigación y definición de problemas",
      "Diseño de experiencias",
      "Priorización",
      "Operación SaaS",
    ],
  },
  {
    id: "desarrollo",
    title: "Desarrollo",
    intro: "Construirlo yo mismo, con una arquitectura que se pueda sostener.",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Arquitectura de aplicaciones",
      "Integraciones",
      "Seguridad",
    ],
  },
  {
    id: "ia",
    title: "Inteligencia artificial",
    intro: "Aplicarla donde acelera trabajo real, no donde queda bien decirlo.",
    items: [
      "Prompt engineering",
      "RAG",
      "Fine-tuning",
      "Automatización de procesos",
      "IA aplicada a producto, desarrollo y operación",
    ],
  },
  {
    id: "negocio",
    title: "Negocio y crecimiento",
    intro: "Entender cómo llega el producto al mercado y qué pasa después.",
    items: [
      "Marketing digital",
      "Transformación digital",
      "Coordinación con agencias",
      "Estrategia comercial",
      "Análisis de operaciones",
    ],
  },
];
