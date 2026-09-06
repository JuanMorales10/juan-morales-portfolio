import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Huella del contenido del CV.
 *
 * El PDF que se descarga es un archivo commiteado, no algo que se genere en
 * cada visita. Eso lo hace rápido y hace que el texto salga exactamente como se
 * verificó, pero abre un riesgo: que alguien edite el contenido y se olvide de
 * regenerarlo, y que el archivo que baja una empresa diga otra cosa que la
 * página. Esta huella cubre todos los archivos de los que depende el PDF; si
 * cambia alguno y el archivo no se regeneró, `verificar-cv.mjs` corta el build.
 */
const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Todo lo que puede cambiar una línea del PDF. */
export const archivosDelCv = [
  "src/components/cv/cv-document.tsx",
  "src/components/cv/print-button.tsx",
  "src/components/primitives/actions.tsx",
  "src/app/cv/page.tsx",
  "src/app/globals.css",
  "src/content/site.ts",
  "src/content/profile.ts",
  "src/content/experience.ts",
  "src/content/capabilities.ts",
];

export function huellaDelCv() {
  const hash = createHash("sha256");
  for (const relativo of archivosDelCv) {
    hash.update(relativo);
    hash.update("\0");
    /* Sin los retornos de carro: en Windows, Git cambia los finales de línea al
       tocar un archivo y el PDF quedaría marcado como viejo sin que nadie haya
       cambiado una palabra. */
    hash.update(readFileSync(join(raiz, relativo), "utf8").replace(/\r\n/g, "\n"));
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 16);
}

export const rutaHuella = join(raiz, "src/content/cv-pdf.json");
export const rutaPdf = join(raiz, "public/Juan-Morales-CV.pdf");
