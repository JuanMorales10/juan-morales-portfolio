import { existsSync, readFileSync } from "node:fs";

import { huellaDelCv, rutaHuella, rutaPdf } from "./cv-huella.mjs";

/**
 * Corta el build si el PDF descargable quedó viejo.
 *
 * Es el precio de servir un archivo commiteado en vez de generarlo en cada
 * visita. Sin este control, una edición del contenido publicaría una página y
 * un PDF que dicen cosas distintas, y el que dice cosas distintas es el que se
 * baja una empresa.
 */
const aviso = (mensaje) => {
  console.error(`\n  ${mensaje}\n  Regeneralo con: npm run cv:pdf\n`);
  process.exit(1);
};

if (!existsSync(rutaPdf)) aviso("Falta el PDF del CV en public/.");
if (!existsSync(rutaHuella)) aviso("Falta la huella del PDF del CV.");

const guardada = JSON.parse(readFileSync(rutaHuella, "utf8")).huella;
const actual = huellaDelCv();

if (guardada !== actual) {
  aviso(`El contenido del CV cambió (${guardada} a ${actual}) y el PDF sigue viejo.`);
}

console.log("PDF del CV al día.");
