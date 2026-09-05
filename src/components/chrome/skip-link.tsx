/**
 * Primer elemento enfocable del documento. Invisible hasta que alguien llega
 * con el teclado. Papel sobre noche, con el foco jade-glow global alrededor.
 */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      data-print="hide"
      className="bg-paper text-night-900 sr-only z-[100] rounded-full px-5 py-3 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4"
    >
      Saltar al contenido
    </a>
  );
}
