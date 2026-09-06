"use client";

import { ActionButton, ActionLink } from "@/components/primitives/actions";

/**
 * Las dos formas de llevarse el CV.
 *
 * La principal es un archivo: `Juan-Morales-CV.pdf` está servido desde el
 * sitio y el enlace lo baja de una. Antes esto abría el diálogo de impresión y
 * le pedía a la persona que eligiera "Guardar como PDF", que es un paso de más
 * justo en el momento en que alguien decidió quedarse con el CV.
 *
 * El archivo no se genera en cada visita: lo imprime Chrome desde esta misma
 * página con `npm run cv:pdf` y se commitea. Por eso el texto sale
 * seleccionable y en el orden del documento, que es lo que necesita leer un
 * sistema de recursos humanos, y por eso `npm run build` se corta si el
 * contenido cambió y el archivo quedó viejo.
 *
 * Imprimir queda como acción secundaria, para quien esté por mandarlo al papel.
 *
 * Todo el bloque lleva `data-print="hide"`: en la hoja no tienen sentido ni la
 * descarga ni el botón de imprimir.
 */
export function PrintButton() {
  return (
    <div data-print="hide" className="flex flex-col items-start gap-2.5 sm:items-end">
      <ActionLink href="/Juan-Morales-CV.pdf" variant="primary" download>
        Descargar CV en PDF
      </ActionLink>
      <ActionButton variant="quiet" className="px-0 py-0" onClick={() => window.print()}>
        o imprimir esta página
      </ActionButton>
    </div>
  );
}
