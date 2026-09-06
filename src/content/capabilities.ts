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
    /*
     * Van también las que Juan usó antes de Rienda y seguía sosteniendo: el
     * lado servidor con Node y Express, y MySQL de los años de Dimo. Un
     * buscador de recursos humanos filtra por estas palabras, y estaban solo
     * adentro de las tareas de un puesto, donde una búsqueda por habilidad no
     * las encuentra. Java y Spring quedan afuera a propósito: los tocó en 2022
     * y no son lo que defendería hoy en una entrevista.
     */
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "MySQL",
      "APIs REST",
      "Git",
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
