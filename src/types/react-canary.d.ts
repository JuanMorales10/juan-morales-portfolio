/// <reference types="react/canary" />

/**
 * El App Router de Next 16 corre sobre una versión canary de React, así que
 * `<ViewTransition>` existe en tiempo de ejecución aunque `@types/react` no la
 * exponga por defecto. Esta referencia activa las definiciones que ya vienen en
 * `@types/react/canary.d.ts`.
 *
 * Es lo que hace que la portada de un proyecto se transforme en la portada de su
 * caso de estudio en lugar de cortar.
 */
export {};
