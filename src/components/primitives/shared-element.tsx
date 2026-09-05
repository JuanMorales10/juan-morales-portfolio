import type { ReactNode } from "react";
import { ViewTransition } from "react";

/**
 * Elemento compartido entre dos rutas.
 *
 * Si la fila de un proyecto y la portada de su caso de estudio declaran el mismo
 * `name`, React empareja los dos y el navegador interpola tamaño y posición: se
 * ve un solo objeto que se mueve, no dos que se reemplazan.
 *
 * `share="morph"` le pone la clase `morph` a la transición para poder ajustarla
 * desde CSS, y `default="none"` evita que este elemento se anime en cualquier
 * otra navegación que no sea la suya.
 *
 * Donde el navegador no soporta View Transitions la navegación sigue siendo la
 * de siempre. No hay nada acá de lo que dependa el contenido.
 *
 * Adaptación del patrón "Shared Element Gallery" de Hossain Jahed (21st.dev):
 * se conserva la idea de continuidad visual y se descarta el lightbox, porque
 * acá el destino es una página real y no un modal.
 */
export function SharedElement({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
