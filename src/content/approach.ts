import type { ProcessStep } from "./types";

/**
 * "Cómo trabajo" y "IA como herramienta de trabajo".
 * Metodología, no publicidad. Nada de interfaces de chatbot falsas.
 */

export const howIWork = {
  eyebrow: "Cómo trabajo",
  title: "Producto, tecnología y negocio son la misma conversación.",
  lead: "Trabajo en los tres lados a la vez porque separarlos es lo que hace que un producto quede lindo y no sirva, o que sirva y nadie lo entienda.",
  pillars: [
    {
      id: "problema",
      title: "Primero el problema del mostrador",
      body: "Antes de diseñar una pantalla quiero saber qué hace una persona a las nueve de la mañana con la caja abierta y un cliente esperando. Esa restricción define casi todo lo demás.",
    },
    {
      id: "conectado",
      title: "Nada suelto",
      body: "Una venta que no toca la caja, el stock, la factura y el reporte es media función. Diseño para que el dato viaje una sola vez y llegue completo.",
    },
    {
      id: "construir",
      title: "Lo construyo, no lo delego",
      body: "Escribo el código, elijo la arquitectura y me hago cargo de la seguridad y del despliegue. Decidir con las manos adentro cambia las decisiones.",
    },
    {
      id: "operar",
      title: "Operar cuenta como diseñar",
      body: "El producto se termina de entender cuando está en producción, con datos reales y alguien que depende de él para cobrar.",
    },
  ],
} as const;

export const aiSection = {
  eyebrow: "IA como herramienta de trabajo",
  title: "No uso inteligencia artificial para reemplazar criterio.",
  lead: "La uso para acelerar investigación, diseño, desarrollo, automatización y operación. El criterio sobre qué construir y qué descartar sigue siendo mío.",
  /** Cinco pasos reales del proceso. No es una demo, es cómo se trabaja. */
  steps: [
    {
      id: "entender",
      title: "Entender el problema",
      body: "Ordeno lo que sé y lo que no. La IA me sirve para hacerme preguntas que no me hice y para encontrar dónde está flojo el razonamiento antes de escribir una línea.",
    },
    {
      id: "investigar",
      title: "Investigar y ordenar información",
      body: "Documentación técnica, normativa de facturación, casos parecidos. Lo que tardaba días en juntar y resumir ahora lleva horas, y me deja tiempo para verificar en la fuente.",
    },
    {
      id: "disenar",
      title: "Diseñar una solución",
      body: "Genero variantes de flujo y de interfaz para descartar rápido. La mayoría se tira. Sirve para llegar antes a la que vale.",
    },
    {
      id: "construir",
      title: "Construir y validar",
      body: "Escribo código acompañado, no dictado: reviso, corrijo y pruebo. Uso IA también para revisar mi propio trabajo y para escribir las pruebas que a mano daría pereza escribir.",
    },
    {
      id: "automatizar",
      title: "Automatizar y mejorar",
      body: "Tareas repetidas de la operación diaria y del soporte pasan a procesos automáticos. Lo que se automatiza se mide y se corrige.",
    },
  ] satisfies ProcessStep[],
  /** Cierre honesto: dónde la IA no decide. */
  closing:
    "Lo que no delego: qué problema vale la pena resolver, qué se publica, qué se cobra y qué datos toca el sistema.",
} as const;
