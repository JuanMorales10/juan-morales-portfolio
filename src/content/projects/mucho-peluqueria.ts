import type { Project } from "../types";

const SHOT_W = 1440;
const SHOT_H = 900;
const MOBILE_W = 390;
const MOBILE_H = 844;

/**
 * Sistema de turnos para Mucho Peluquería (Mendoza).
 *
 * Todo lo que se afirma acá sale del repositorio del proyecto: README,
 * documentación de arquitectura, hoja de ruta e historial de commits. No hay
 * cantidad de turnos, clientes ni ingresos porque no hay ninguno verificado
 * para publicar. Las capturas se tomaron del sitio público corriendo en
 * desarrollo; ver `shotsDisclaimer`.
 */
export const muchoPeluqueria: Project = {
  slug: "mucho-peluqueria",
  status: "published",
  name: "Mucho Peluquería",
  role: "Diseño, desarrollo y puesta en producción",
  kind: "para un cliente",
  client: "Mucho Peluquería (Mendoza)",
  /* Naranja de la marca del salón, tal como está definido en su hoja de estilos. */
  accent: "#D55204",
  start: "2026-07",
  end: null,
  tagline: "Turnos por web, WhatsApp y mostrador sobre una sola agenda.",
  summary:
    "Sistema de turnos para un salón de Mendoza: sitio público, reserva web, asistente de WhatsApp y panel del salón, todos sobre la misma agenda y con una sola regla que manda sobre el resto: nunca dos turnos en el mismo horario con el mismo profesional.",
  year: "Desde julio de 2026",
  disciplines: ["Producto", "Diseño web", "Desarrollo", "Bot de WhatsApp"],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
    "Tailwind CSS",
    "Baileys (WhatsApp)",
    "DeepSeek",
    "Vitest",
    "Vercel",
  ],
  /* El dominio definitivo del salón todavía no está confirmado, así que no se linkea. */
  links: [],
  cover: {
    src: "/mucho-peluqueria/landing-portada.png",
    alt: "Portada del sitio de Mucho Peluquería: el nombre del salón en letras enormes, la bajada Pelo con intención, turnos sin vueltas, el botón Ver horarios disponibles y la foto de perfil de una clienta con el pelo largo y negro.",
    width: SHOT_W,
    height: SHOT_H,
  },
  shotsDisclaimer:
    "Capturas del sitio público. Los servicios, precios y horarios que se ven son los que tenía cargados el sistema al momento de la captura y pueden haber cambiado. Los nombres del equipo son de demostración, y la conversación de WhatsApp es el guion de demo que muestra la propia landing, no un chat real.",

  blocks: [
    {
      id: "problema",
      heading: "El problema",
      paragraphs: [
        "Mucho toma los turnos a mano por WhatsApp: cada turno es una conversación que alguien del salón tiene que leer, contestar y anotar en la agenda, con la clientela esperando del otro lado.",
        "Las plataformas de turnos que existen resuelven la agenda, pero le piden a la clientela que salga de WhatsApp y entre a un link. Para un salón que ya vive en WhatsApp, cambiarle el hábito a la gente es el costo más alto de todos.",
      ],
    },
    {
      id: "solucion",
      heading: "La solución",
      paragraphs: [
        "Una sola agenda con tres puertas: la web pública, un asistente de WhatsApp y el panel del salón. La regla de oro es que nunca haya dos turnos en el mismo horario con el mismo profesional, y eso no depende de que el código se acuerde de chequear. La agenda se parte en celdas de quince minutos, cada turno reserva las suyas en una transacción y una restricción de unicidad en la base rechaza la segunda reserva del mismo lugar. Si dos pedidos llegan a la vez, uno gana y el otro se revierte entero.",
        "La landing, la reserva y el panel salen de una sola aplicación desplegada en Vercel. El bot corre como proceso aparte en un servidor propio, porque necesita una conexión permanente con WhatsApp, y escribe en la misma base. El asistente conversa con un modelo de lenguaje, pero el código ejecuta y valida cada acción: los horarios salen solo de la base y reservar exige una hora que el sistema ofreció antes. Si falta la clave del modelo, el bot cae a un flujo por números y sigue atendiendo.",
        "El panel deja operar el día: agenda por hora y vista de mes, reprogramar, cancelar y bloquear horarios, turnos cargados a mano, equipo y jornada configurables, servicios con precio y duración, ficha de cliente, lista de espera, recordatorios con confirmación por WhatsApp y métricas del salón.",
      ],
    },
    {
      id: "rol",
      heading: "Mi participación",
      paragraphs: [
        "Es un trabajo para un cliente real y lo llevé de punta a punta desde julio de 2026: desde el relevamiento con los dueños hasta el sistema en producción.",
      ],
      bullets: [
        "Relevamiento con los dueños: cómo toman turnos hoy, servicios, horarios, sedes y marca.",
        "Arquitectura: una aplicación Next.js sobre PostgreSQL, y el bot como proceso aparte sobre la misma base.",
        "Diseño y desarrollo de la landing, del flujo de reserva y del panel del salón.",
        "El asistente de WhatsApp: agente conversacional con acciones validadas en código, recordatorios y confirmación del turno.",
        "Seguridad: sesión del panel, límites de intentos, cabeceras HTTP y datos mínimos del cliente.",
        "Puesta en producción: Vercel para la web, un VPS para el bot, migraciones y copias de seguridad de la base.",
        "Tests de la lógica de agenda, incluido el de dos reservas simultáneas al mismo horario.",
      ],
    },
    {
      id: "decisiones",
      heading: "Decisiones y aprendizajes",
      paragraphs: [],
      bullets: [
        "La integridad de la agenda vive en la base, no en el código. Un chequeo antes de guardar se puede olvidar o llegar tarde; una restricción de unicidad, no.",
        "La IA propone, el código decide. El asistente conversa en lenguaje natural, pero no puede inventar un horario ni reservar uno que no se ofreció, y no tiene ninguna función de administración del salón: eso vive solo en el panel, detrás de login.",
        "Preferir que falte antes que inventar. Las reseñas salen de Google o la sección no se muestra; el equipo y los salones no llevan fotos de stock; las figuras con las que trabajó el salón se nombran sin adjudicar roles que nadie confirmó.",
        "Sin estado pendiente. El turno siempre queda confirmado y el recordatorio pide un OK que se registra aparte. Un turno que expira si nadie contesta es una máquina de estados para mantener para siempre, en un producto que se vende con mantenimiento acotado.",
        "La lista de espera la avisa una persona, no el sistema. Avisar solo al primero deja el hueco muerto si no contesta; avisar a todos arma una carrera por el mismo horario.",
        "Medir antes de asumir. Cuando el panel tardaba entre pestañas, la causa no estaba en el código: la función corría en Estados Unidos y la base en San Pablo. Una línea de configuración lo resolvió. El pooler de conexiones que siempre se recomienda para serverless se probó, se midió y se descartó.",
        "Registrar cada mensaje que entra al bot y por qué se descarta. Desde afuera, que no escriba nadie y que entren mensajes y se estén tirando se ven idénticos.",
        "La paleta es la del cliente: blanco, negro y su naranja, nada más. Los componentes del catálogo de 21st.dev que entraron a la landing se adaptaron a esa paleta, a fotos en formato retrato y a movimiento reducido, con la lista de cambios escrita en cada archivo.",
      ],
    },
  ],

  areas: [
    {
      id: "sitio",
      label: "Sitio",
      title: "La marca del salón, en pantalla",
      body: "Blanco, negro y el naranja de Mucho, con la tipografía que eligieron los dueños y sus fotos reales. El sitio lee los servicios, las sedes y el equipo de la misma base que usan la reserva y el bot, así que un cambio en el panel se ve en la landing.",
      shot: {
        src: "/mucho-peluqueria/landing-portada.png",
        alt: "Portada del sitio de Mucho Peluquería con el nombre del salón en letras enormes, la bajada, el botón Ver horarios disponibles y la foto de perfil de una clienta.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "servicios",
      label: "Servicios",
      title: "Precio y duración a la vista",
      body: "Cada servicio muestra lo que cuesta y cuánto lleva, y su fila entera lleva a reservar con ese servicio ya elegido. Los precios los editan los dueños desde el panel; no hay que tocar código.",
      shot: {
        src: "/mucho-peluqueria/landing-servicios.png",
        alt: "Carta de servicios del sitio: seis servicios con foto, descripción, duración y precio, cada uno con un enlace a ver horarios.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "reserva",
      label: "Reserva web",
      title: "Del servicio al horario en tres pasos",
      body: "Servicio, día y hora, datos. Los horarios se calculan sobre la agenda real y se espacian según la duración del servicio; se puede elegir profesional o dejar que sea cualquiera. Si el horario se ocupa entre elegir y confirmar, el flujo vuelve al paso del horario y consulta de nuevo.",
      shot: {
        src: "/mucho-peluqueria/reservar-horarios.png",
        alt: "Paso dos del flujo de reserva: elegir profesional, los próximos días abiertos, los horarios libres del día agrupados por tarde y tarde noche, y el resumen del turno con servicio, salón, duración y total.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      title: "El mismo turno, conversando",
      body: "El asistente entiende un pedido en lenguaje natural, busca horarios reales y confirma en la misma agenda que la web y el mostrador. También recuerda el turno el día anterior y registra si la persona confirmó. La landing lo muestra con un chat de demostración dentro de un teléfono dibujado.",
      shot: {
        src: "/mucho-peluqueria/landing-whatsapp.png",
        alt: "Sección Reservá sin llamar del sitio: las dos opciones, en la web y por WhatsApp, y un teléfono dibujado con el chat de demostración del asistente ofreciendo horarios y confirmando un turno.",
        width: SHOT_W,
        height: SHOT_H,
      },
    },
  ],

  gallery: [
    {
      src: "/mucho-peluqueria/landing-vitrina.png",
      alt: "Banda naranja con los seguidores y trabajos publicados de Mucho en Instagram y, debajo, la vitrina: una grilla en perspectiva con fotos de las producciones del salón y el titular Todo esto salió de Mucho.",
      width: SHOT_W,
      height: SHOT_H,
      caption:
        "La vitrina es el 3D Marquee de Aceternity, del catálogo de 21st.dev, adaptado a la paleta del salón, a fotos verticales y a movimiento reducido.",
    },
    {
      src: "/mucho-peluqueria/reservar-horarios-movil.png",
      alt: "El paso de día y horario de la reserva en un teléfono: profesional, próximos días y horarios libres agrupados por franja.",
      width: MOBILE_W,
      height: MOBILE_H,
      caption:
        "La landing y la reserva se hicieron primero para el teléfono y después para la pantalla grande.",
    },
  ],

  seo: {
    title: "Mucho Peluquería, turnos por web y WhatsApp sobre una sola agenda",
    description:
      "Caso de estudio de Mucho Peluquería: sitio, reserva web, asistente de WhatsApp y panel del salón para una peluquería de Mendoza. Diseño, desarrollo y puesta en producción por Juan Morales.",
  },
};
