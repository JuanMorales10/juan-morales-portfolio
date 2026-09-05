import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Las pruebas leen el contenido tipado, no el DOM: con `node` alcanza y evita
 * arrastrar un entorno de navegador que acá no aporta nada. El alias repite el
 * de `tsconfig.json` para que los imports `@/...` funcionen igual.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
