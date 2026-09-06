import { isPlaceholder, showPending } from "./site";
import type { Credential, Language, Role } from "./types";

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
  {
    id: "barcelona-junior",
    /* Juan corrigió que este puesto fue en una empresa de España y en nivel
       junior. Hasta que dé el nombre real, la empresa queda como marcador y el
       puesto no se publica: ver `publishedRoles` más abajo. */
    company: "[EMPRESA_BARCELONA]",
    title: "Desarrollador full stack junior",
    location: "Barcelona, España",
    start: "2024-01",
    end: "2024-11",
    period: "Enero a noviembre de 2024",
    summary: "Desarrollo web sobre un producto de reservas y membresías.",
    responsibilities: [
      "Frontend con React, HTML5 y CSS3.",
      "APIs REST con Node.js y Express, sobre una base MySQL.",
    ],
  },
  {
    id: "dimo",
    company: "Dimo",
    title: "Arquitecto y desarrollador web full stack",
    start: "2023-08",
    end: "2024-01",
    period: "Agosto de 2023 a enero de 2024",
    summary:
      "Plataforma de viajes con reservas y pagos en línea, desde la arquitectura hasta la interfaz.",
    responsibilities: [
      "Interfaces de usuario con React, con foco en la navegación.",
      "Backend con Node.js y Express, con una arquitectura pensada para escalar.",
      "Diseño y gestión de la base de datos MySQL, optimizada para reservas y consultas.",
      "Integración de Google Calendar, Google Maps y Mercado Pago.",
      "Sistema de reservas propio para la planificación de viajes.",
    ],
  },
];

/**
 * Los puestos que sí salen publicados.
 *
 * Un CV con una empresa inventada es un documento falso, así que un puesto cuya
 * empresa todavía es un marcador se queda afuera del sitio y del PDF. En
 * desarrollo se ve igual, para no olvidarlo: es la misma regla que `site.ts`
 * aplica a los datos de contacto.
 */
export const publishedRoles: Role[] = roles.filter(
  (role) => showPending || !isPlaceholder(role.company),
);

/**
 * Idiomas, tal como los declaró Juan en su CV anterior. Sin certificados que
 * los respalden, así que van con el nivel dicho en palabras y no con el marco
 * común europeo, que promete una acreditación que no existe.
 */
export const languages: Language[] = [
  { id: "castellano", name: "Castellano", level: "Nativo" },
  { id: "ingles", name: "Inglés", level: "Nivel alto" },
  { id: "portugues", name: "Portugués", level: "Nivel básico" },
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
