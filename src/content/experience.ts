import type { Credential, Role } from "./types";

/**
 * Recorrido profesional. Fechas y responsabilidades tal como las declaró Juan.
 * No hay resultados comerciales acá porque no hay ninguno verificado.
 */
export const roles: Role[] = [
  {
    id: "rienda",
    company: "Rienda",
    companyUrl: "https://rienda.ar",
    title: "Cofundador y CEO",
    start: "2026-02",
    end: null,
    period: "Febrero de 2026 a hoy",
    summary:
      "Plataforma integral para comercios argentinos: ventas, caja, stock, facturación electrónica, canales online y reportes trabajando conectados.",
    responsibilities: [
      "Estrategia de producto y definición de los problemas que vale la pena resolver.",
      "Experiencia de usuario de toda la operación diaria del comercio.",
      "Arquitectura y desarrollo de la aplicación.",
      "Integraciones con facturación electrónica, canales de venta y WhatsApp.",
      "Seguridad y aislamiento de datos entre comercios.",
      "Operación del producto SaaS: despliegues, monitoreo y soporte.",
    ],
    project: "rienda",
  },
  {
    id: "poltrona",
    company: "Poltrona de Interiores",
    title: "Responsable de Tecnología y Marketing",
    start: "2026-05",
    end: null,
    period: "Mayo de 2026 a hoy",
    summary:
      "Decisiones tecnológicas, mejoras digitales y coordinación del trabajo con la agencia externa de marketing.",
    responsibilities: [
      "Coordinación de las decisiones tecnológicas de la empresa.",
      "Mejoras digitales sobre los canales existentes.",
      "Trabajo con la agencia externa de marketing.",
      "Definición de objetivos, planes, reuniones, seguimiento y estrategia.",
      "Diseño y desarrollo del portal interno de presupuestos y gestión comercial.",
    ],
    project: "portal-poltrona",
  },
];

export const credentials: Credential[] = [
  {
    id: "digital-house",
    institution: "Digital House",
    program: "Full Stack Web Development",
    period: "Abril a noviembre de 2023",
    details: ["Desarrollo web full stack."],
  },
  {
    id: "egg",
    institution: "Egg Cooperation / Egg Live",
    program: "Full-Stack Developer",
    period: "Septiembre de 2021 a noviembre de 2022",
    details: ["Calificación final: 91."],
  },
  {
    id: "esplai",
    institution: "Fundación Esplai / Talent IT",
    program: "IA: bases, prompt engineering, RAG y fine-tuning",
    period: "Junio a julio de 2024",
    details: [
      "150 horas lectivas.",
      "60 horas dedicadas a prompt engineering, RAG y fine-tuning.",
      "Bases de la inteligencia artificial, variantes técnicas, seguridad y aspectos legales y éticos.",
      "Proyecto final.",
    ],
    note: "Certificado de aprovechamiento emitido en Barcelona. El original no se publica acá porque incluye un número de identificación personal.",
  },
];
