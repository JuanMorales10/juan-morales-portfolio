import Image from "next/image";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/primitives/reveal";
import { ScrollParallax } from "@/components/primitives/scroll-parallax";
import { Section, SectionLabel } from "@/components/primitives/section";
import { BlurFade } from "@/components/ui/blur-fade";
import { StickyScroll, type StickyScrollItem } from "@/components/ui/sticky-scroll-reveal";
import { aiSection, howIWork } from "@/content/approach";
import { ahorrito } from "@/content/projects/ahorrito";
import { llavero } from "@/content/projects/llavero";
import { muchoPeluqueria } from "@/content/projects/mucho-peluqueria";
import { portalPoltrona } from "@/content/projects/portal-poltrona";
import { rienda } from "@/content/projects/rienda";
import type { Project, Shot } from "@/content/types";

type StepId = (typeof aiSection.steps)[number]["id"];

type Evidence = {
  project: Project;
  shot: Shot;
};

/**
 * Qué captura acompaña a cada paso. Una por proyecto y ninguno repetido: el
 * proceso se cuenta con las cinco pruebas, no con íconos.
 *
 * El tipo es `Record<StepId, ...>` a propósito: si aparece un paso nuevo en el
 * contenido sin su captura, no compila.
 */
const evidence: Record<StepId, Evidence> = {
  // Entender el problema del mostrador: la pantalla de venta de Rienda.
  entender: { project: rienda, shot: rienda.cover },
  // Ordenar información: el armador de presupuestos de Poltrona, catálogo y filtros.
  investigar: { project: portalPoltrona, shot: portalPoltrona.cover },
  // Diseñar variantes para descartar: la maqueta de El parte, de Llavero.
  disenar: { project: llavero, shot: llavero.cover },
  // Construir y validar: el sitio de Mucho, en producción.
  construir: { project: muchoPeluqueria, shot: muchoPeluqueria.cover },
  // Automatizar y medir: el Cerebro Digital de Ahorrito con una neurona enfocada.
  automatizar: {
    project: ahorrito,
    shot: ahorrito.gallery.find((shot) => shot.src.endsWith("/cerebro-foco.png")) ?? ahorrito.cover,
  },
};

/**
 * Desde 1024px el panel mide siete columnas de la grilla; el `.shell` se
 * congela en 1536px, así que arriba de eso el ancho es fijo.
 */
const shotSizes = "(max-width: 1023px) 100vw, (max-width: 1536px) 56vw, 800px";

/**
 * Cuando la captura flota, va un 12% más alta que su marco: ese sobrante es lo
 * que tapa el desplazamiento del parallax para que no asome el fondo.
 *
 * La cuenta que fija el rango: el fondo asomaría en el borde del marco que
 * está en pantalla, y el peor caso es el marco entero pegado al borde de la
 * ventana. Ahí el progreso del parallax es (alto del marco + margen) / (alto
 * de la ventana + alto de la captura) y el corrimiento, R * (1 - 2p). A
 * 390x844 con las capturas 16:9 (Llavero, Cerebro), las de menos margen (unos
 * 10px por lado), eso da 0,65 * R: con 16px no asoma nada, con 18 ya sí. En
 * 360x800, 375x667, 412x915, 430x932 y 768x1024 sobra margen.
 */
const FLOAT_OVERFLOW = 1.12;
const FLOAT_RANGE: [number, number] = [-16, 16];

type EvidenceStyle = CSSProperties & { "--accent": string; "--shot-ratio"?: string };

/**
 * Una captura en su marco, con el halo del acento del proyecto detrás y el
 * nombre del proyecto al pie. `isolate` crea el contexto de apilamiento para
 * que el halo con z negativo quede detrás de la pantalla y no detrás de la
 * sección entera.
 *
 * Con `float`, la versión para la lista de pantallas chicas (ronda 3): debajo
 * de `lg` el marco se achica al alto de la captura menos el sobrante y la
 * imagen se desplaza adentro con el scroll; el marco entra con `Reveal` (solo
 * transform y opacidad, nada de desenfoque sobre un bitmap en el teléfono) y
 * el pie llega un poco después. El recorte va detrás de `motion-safe:`: con
 * movimiento reducido el parallax devuelve cero y recortar la captura sería
 * perder un 12% de pantalla a cambio de nada, así que se ve entera. En el
 * panel fijo del escritorio va la versión sin `float`, que no cambió.
 */
function StepEvidence({ project, shot, float = false }: Evidence & { float?: boolean }) {
  const style: EvidenceStyle = { "--accent": project.accent };

  const halo = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10"
      style={{
        background:
          "radial-gradient(70% 60% at 50% 55%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 72%)",
      }}
    />
  );

  const image = (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      sizes={shotSizes}
      className="h-auto w-full"
    />
  );

  const caption = (
    <>
      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
      <span className="text-paper">{project.name}</span>
      <span>{project.kind}</span>
    </>
  );

  if (!float) {
    return (
      <figure className="relative isolate" style={style}>
        {halo}

        <div className="screen">{image}</div>

        <figcaption className="text-micro text-paper-faint mt-4 flex items-center gap-2.5 font-mono">
          {caption}
        </figcaption>
      </figure>
    );
  }

  const floatStyle: EvidenceStyle = {
    ...style,
    "--shot-ratio": ((shot.width * FLOAT_OVERFLOW) / shot.height).toFixed(4),
  };

  return (
    <figure className="relative isolate" style={floatStyle}>
      {halo}

      <Reveal>
        {/* `.screen` ya recorta; el flex centra la imagen, que sobra igual arriba y abajo. */}
        <div className="screen motion-safe:max-lg:flex motion-safe:max-lg:aspect-(--shot-ratio) motion-safe:max-lg:items-center">
          <ScrollParallax range={FLOAT_RANGE} className="w-full shrink-0">
            {image}
          </ScrollParallax>
        </div>
      </Reveal>

      <figcaption className="text-micro text-paper-faint mt-4 font-mono">
        <BlurFade inView delay={0.2} className="flex items-center gap-2.5">
          {caption}
        </BlurFade>
      </figcaption>
    </figure>
  );
}

/**
 * Cómo trabajo.
 *
 * La apertura es el texto de `howIWork`: título a la izquierda, bajada abajo a
 * la derecha. Después, los cinco pasos del proceso de `aiSection.steps` en el
 * Sticky Scroll adaptado: los pasos se leen bajando y el panel fijo muestra,
 * para cada uno, una captura real de un proyecto distinto. Debajo de `lg` no
 * hay panel: cada paso lleva su captura debajo, flotando con el scroll.
 *
 * El rótulo de la sección es la única `.meta`; el nombre del proyecto al pie de
 * cada captura va en monoespaciada chica, como las notas de la presentación,
 * para no repetir el rótulo cinco veces.
 */
export function HowIWork() {
  const items: StickyScrollItem[] = aiSection.steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.body,
    content: <StepEvidence {...evidence[step.id]} />,
    listContent: <StepEvidence {...evidence[step.id]} float />,
  }));

  // `clip` y no `hidden`: recorta el halo que sobresale de cada captura sin
  // crear un contenedor de scroll, que anularía el `sticky` del panel.
  return (
    <Section id="como-trabajo" labelledBy="como-trabajo-titulo" className="overflow-x-clip">
      <div className="grid12 gap-y-8">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <SectionLabel>{howIWork.eyebrow}</SectionLabel>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 id="como-trabajo-titulo" className="text-h2 mt-10 max-w-[16ch]">
              {howIWork.title}
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lead text-paper-muted">{howIWork.lead}</p>
        </Reveal>
      </div>

      <div className="mt-16 md:mt-24">
        <StickyScroll content={items} />
      </div>
    </Section>
  );
}
