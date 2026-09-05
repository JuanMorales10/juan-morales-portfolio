"use client";

import { ActionButton } from "@/components/primitives/actions";

/**
 * Descarga del CV en PDF.
 *
 * No generamos el archivo nosotros ni sumamos una librería para eso: llamamos
 * al diálogo de impresión y dejamos que el navegador aplique el bloque
 * `@media print` de globals.css. Lo que sale es un PDF real, en blanco y
 * negro, con el texto seleccionable y los enlaces impresos al lado de cada
 * nombre, en vez de una imagen del documento. El costo es que hay que decirle a
 * la persona qué va a pasar cuando aprete, y eso lo resuelve la línea de abajo.
 *
 * Todo el bloque lleva `data-print="hide"`: en la hoja no tiene sentido un
 * botón para imprimir, así que no hace falta corregirle el color.
 */
export function PrintButton() {
  return (
    <div
      data-print="hide"
      className="flex flex-col items-start gap-2.5 sm:items-end"
    >
      <ActionButton variant="primary" onClick={() => window.print()}>
        Descargar PDF
      </ActionButton>
      <p className="text-paper-faint text-micro max-w-[30ch] sm:text-right">
        Se abre el diálogo de impresión: elegí Guardar como PDF.
      </p>
    </div>
  );
}
