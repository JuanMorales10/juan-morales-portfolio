/**
 * El sitio, legible sin JavaScript.
 *
 * Motion imprime en el HTML el estado inicial de cada animación, que casi
 * siempre es `opacity: 0`. Es lo correcto mientras el JavaScript corre, pero si
 * no corre (una red que se cae a mitad del bundle, un proxy corporativo, una
 * extensión, un rastreador viejo) el sitio queda en blanco. Un portfolio no se
 * puede dar ese lujo.
 *
 * Este bloque neutraliza esos estados iniciales y, en la escena de Rienda,
 * cambia al mismo layout apilado que ya se usa en pantallas chicas: sin GSAP el
 * panel fijo no cambiaría nunca de captura, así que directamente no se muestra.
 *
 * El navegador solo aplica esto cuando el scripting está deshabilitado.
 */
export function NoScriptFallback() {
  return (
    <noscript>
      <style>{`
        [style*="opacity:0"],
        [style*="opacity: 0"],
        [style*="translateY(110%)"],
        [style*="blur("] {
          opacity: 1 !important;
          transform: none !important;
          filter: none !important;
        }
        [data-rienda-panel] { display: none !important; }
        [data-rienda-copy] { grid-column: 1 / -1 !important; }
        [data-rienda-flow-shot] { display: block !important; }
      `}</style>
    </noscript>
  );
}
