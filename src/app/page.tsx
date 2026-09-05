import { AiWork } from "@/components/sections/ai-work";
import { Capabilities } from "@/components/sections/capabilities";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { HowIWork } from "@/components/sections/how-i-work";
import { Intro } from "@/components/sections/intro";
import { Projects } from "@/components/sections/projects";
import { RiendaFeature } from "@/components/sections/rienda-feature";
import { StackMarquee } from "@/components/sections/stack-marquee";

/**
 * Orden de lectura de la home, v2.
 *
 * Primero el impacto (hero con las capturas de los cinco proyectos y la franja
 * de stack), una presentación corta, y enseguida la prueba: los proyectos,
 * todos. Rienda tiene después su momento propio por ser el producto vivo que
 * Juan dirige hoy, pero es uno de cinco. Cómo trabaja, la IA y el recorrido
 * formal cierran, con el contacto al final.
 */
export default function Home() {
  return (
    <main id="contenido">
      <Hero />
      <StackMarquee />
      <Intro />
      <Projects />
      <RiendaFeature />
      <HowIWork />
      <AiWork />
      <Experience />
      <Education />
      <Capabilities />
      <Contact />
    </main>
  );
}
