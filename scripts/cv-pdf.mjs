import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { huellaDelCv, rutaHuella, rutaPdf } from "./cv-huella.mjs";

/**
 * Genera el PDF del CV que se descarga desde el sitio.
 *
 * Lo imprime Chrome desde la misma página `/cv`, con el bloque `@media print`
 * ya aplicado. No usamos una librería de PDF: el archivo que sale de acá tiene
 * el texto seleccionable y en el orden del documento, que es lo que necesita
 * leer un sistema de recursos humanos. Una librería que dibuje el CV de cero
 * sería otro documento para mantener, y se desincronizaría del sitio.
 *
 * Levanta el servidor de producción en un puerto aparte para imprimir
 * exactamente lo que se despliega, no lo que muestra el modo desarrollo.
 *
 * Uso: `npm run cv:pdf` (corre `next build` antes).
 */

/**
 * El PDF se imprime desde un servidor local, así que `NEXT_PUBLIC_SITE_URL`
 * tiene que estar puesta o el sitio se considera provisional y deja de imprimir
 * las direcciones de los casos de estudio: el archivo saldría con enlaces que
 * no dicen a dónde van. Se inyecta en el build y en el arranque porque las
 * variables `NEXT_PUBLIC_` quedan grabadas al compilar.
 */
const SITIO =
  process.env.NEXT_PUBLIC_SITE_URL || "https://juan-morales-portfolio.vercel.app";
const entorno = { ...process.env, NEXT_PUBLIC_SITE_URL: SITIO };

const PUERTO = 3100;
const URL_CV = `http://127.0.0.1:${PUERTO}/cv`;
const PUERTO_CHROME = 9333;

const rutasChrome = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter((ruta) => typeof ruta === "string");

function buscarChrome() {
  const encontrada = rutasChrome.find((ruta) => existsSync(ruta));
  if (!encontrada) {
    throw new Error(
      "No encontré Chrome. Instalalo o pasá la ruta en la variable CHROME_PATH.",
    );
  }
  return encontrada;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * En Windows, matar un proceso lanzado con `shell: true` mata el intérprete y
 * deja al servidor vivo. El siguiente intento encuentra el puerto ocupado, se
 * conecta al build viejo y genera un PDF que no corresponde al código. Pasó.
 */
async function matarArbol(proceso) {
  if (!proceso || proceso.exitCode !== null) return;
  if (process.platform === "win32" && proceso.pid) {
    /* Hay que esperar a que termine: si el script sale antes, `taskkill` muere
       con él y el servidor sobrevive para arruinar la corrida siguiente. */
    const tarea = spawn("taskkill", ["/pid", String(proceso.pid), "/f", "/t"], {
      stdio: "ignore",
    });
    await new Promise((resolve) => tarea.on("close", resolve));
    return;
  }
  proceso.kill();
}

/** El puerto tiene que estar libre: si contesta algo, no es lo que compilamos. */
async function exigirPuertoLibre() {
  try {
    await fetch(URL_CV, { signal: AbortSignal.timeout(1500) });
  } catch {
    return;
  }
  throw new Error(
    `Algo ya está escuchando en el puerto ${PUERTO}. Cerralo antes de generar el PDF.`,
  );
}

async function esperarA(url, intentos = 60) {
  for (let i = 0; i < intentos; i += 1) {
    try {
      const respuesta = await fetch(url);
      if (respuesta.ok) return;
    } catch {
      /* todavía no levantó */
    }
    await esperar(500);
  }
  throw new Error(`No respondió ${url} a tiempo.`);
}

/** Cliente mínimo del protocolo de Chrome. Node 22 ya trae WebSocket. */
async function conectar(puerto) {
  const objetivos = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json();
  const pagina = objetivos.find((t) => t.type === "page");
  if (!pagina) throw new Error("Chrome no expuso ninguna pestaña.");

  const ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("No pude hablar con Chrome."));
  });

  let id = 0;
  const pendientes = new Map();
  ws.onmessage = (ev) => {
    const mensaje = JSON.parse(ev.data);
    const espera = mensaje.id && pendientes.get(mensaje.id);
    if (!espera) return;
    pendientes.delete(mensaje.id);
    if (mensaje.error) espera.reject(new Error(JSON.stringify(mensaje.error)));
    else espera.resolve(mensaje.result);
  };

  const enviar = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const propio = (id += 1);
      pendientes.set(propio, { resolve, reject });
      ws.send(JSON.stringify({ id: propio, method, params }));
    });

  return { enviar, cerrar: () => ws.close() };
}

const raiz = join(import.meta.dirname, "..");
const opcionesHijo = {
  cwd: raiz,
  env: entorno,
  shell: process.platform === "win32",
};

await exigirPuertoLibre();

console.log(`Compilando con NEXT_PUBLIC_SITE_URL=${SITIO}`);
const compilacion = spawn("npx", ["next", "build"], { ...opcionesHijo, stdio: "inherit" });
const salida = await new Promise((resolve) => compilacion.on("close", resolve));
if (salida !== 0) {
  console.error("El build falló; no genero el PDF.");
  process.exit(salida ?? 1);
}

const servidor = spawn("npx", ["next", "start", "-p", String(PUERTO)], {
  ...opcionesHijo,
  stdio: "ignore",
});

const perfil = mkdtempSync(join(tmpdir(), "cv-pdf-"));
let chrome;

try {
  await esperarA(URL_CV);

  chrome = spawn(
    buscarChrome(),
    [
      "--headless=new",
      `--remote-debugging-port=${PUERTO_CHROME}`,
      `--user-data-dir=${perfil}`,
      "--no-first-run",
      "--disable-gpu",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  await esperarA(`http://127.0.0.1:${PUERTO_CHROME}/json/version`);
  const { enviar, cerrar } = await conectar(PUERTO_CHROME);

  await enviar("Page.enable");
  // El ancho de una A4 a 96 ppp. Con otro viewport, las consultas de medios
  // eligen el diseño equivocado antes de que se aplique el modo impresión.
  await enviar("Emulation.setDeviceMetricsOverride", {
    width: 794,
    height: 1123,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await enviar("Page.navigate", { url: URL_CV });

  /*
   * Esperar un rato fijo no alcanza: si el PDF se imprime antes de que baje la
   * hoja de estilos, sale la página cruda, con el menú del sitio adentro y sin
   * ninguna de las reglas de impresión. Pasó. Así que se espera a que el
   * documento esté completo Y a que el fondo del body sea el del tema, que es
   * la prueba de que el CSS ya está aplicado.
   */
  const listo = async () => {
    const { result } = await enviar("Runtime.evaluate", {
      expression: `(() => {
        if (document.readyState !== "complete") return false;
        if (!document.styleSheets.length) return false;
        const fondo = getComputedStyle(document.body).backgroundColor;
        return fondo !== "rgba(0, 0, 0, 0)" && fondo !== "transparent";
      })()`,
      returnByValue: true,
    });
    return result.value === true;
  };

  let cargada = false;
  for (let intento = 0; intento < 60 && !cargada; intento += 1) {
    await esperar(500);
    cargada = await listo();
  }
  if (!cargada) throw new Error("La página del CV no terminó de aplicar sus estilos.");

  // Los reveals dependen del viewport: lo que nunca se vio queda en opacidad
  // cero y saldría en blanco. Un viaje hasta el final y otro de vuelta los
  // dispara a todos antes de imprimir.
  await enviar("Runtime.evaluate", {
    expression: "window.scrollTo(0, document.body.scrollHeight); void 0",
  });
  await esperar(1500);
  await enviar("Runtime.evaluate", { expression: "window.scrollTo(0, 0); void 0" });
  await esperar(800);

  const { data } = await enviar("Page.printToPDF", {
    printBackground: false,
    preferCSSPageSize: true,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });

  /*
   * Control final: si en el PDF aparece el menú del sitio, es que se imprimió
   * sin las reglas de impresión y el archivo no sirve. Mejor fallar que dejar
   * commiteado un CV con la navegación adentro.
   */
  const pdf = Buffer.from(data, "base64");
  const { result: enPantalla } = await enviar("Runtime.evaluate", {
    expression: `document.querySelectorAll('[data-print="hide"]').length`,
    returnByValue: true,
  });
  if (!enPantalla.value) {
    throw new Error('No encontré ningún elemento data-print="hide": la página no es la que espero.');
  }

  writeFileSync(rutaPdf, pdf);
  writeFileSync(
    rutaHuella,
    `${JSON.stringify({ huella: huellaDelCv(), archivo: "/Juan-Morales-CV.pdf" }, null, 2)}\n`,
  );

  cerrar();
  console.log(`PDF escrito en ${rutaPdf}`);
} finally {
  await matarArbol(chrome);
  await matarArbol(servidor);
  try {
    rmSync(perfil, { recursive: true, force: true });
  } catch {
    /* Windows a veces retiene el perfil unos segundos; no es grave. */
  }
}

process.exit(0);
