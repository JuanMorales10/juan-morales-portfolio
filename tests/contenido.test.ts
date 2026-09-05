import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { aiSection, howIWork } from "@/content/approach";
import { capabilities } from "@/content/capabilities";
import { credentials, roles } from "@/content/experience";
import { hero, intro } from "@/content/profile";
import { projects, publishedProjects } from "@/content/projects";
import {
  contactLinks,
  isPlaceholder,
  navigation,
  pendingAssets,
  site,
} from "@/content/site";

/**
 * Estas pruebas no verifican que el contenido sea lindo: verifican lo que se
 * rompe en silencio al agregar un proyecto, corregir un texto o mover una
 * página. Una imagen que quedó sin subir, un slug repetido, un caso publicado a
 * medias, un guion largo que se coló desde un editor o una ruta del sitemap que
 * ya no existe no fallan el build, fallan acá.
 */

const appDir = resolve(process.cwd(), "src/app");
const contentDir = resolve(process.cwd(), "src/content");
const componentsDir = resolve(process.cwd(), "src/components");
const publicDir = resolve(process.cwd(), "public");

/** Archivos de un árbol que coinciden con el patrón, leídos como texto. */
function sourceFiles(dir: string, match: RegExp, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, match, out);
    else if (match.test(entry.name)) out.push(full);
  }
  return out;
}

/** Recorre el contenido ya evaluado y junta cada cadena que llega a pantalla. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value !== null && typeof value === "object") {
    for (const item of Object.values(value as Record<string, unknown>)) {
      collectStrings(item, out);
    }
  }
  return out;
}

/** Objetos con forma de `Shot`: los que tienen `src`, vengan de donde vengan. */
function collectShots(
  value: unknown,
  out: Array<{ src: string; alt: unknown }> = [],
): Array<{ src: string; alt: unknown }> {
  if (Array.isArray(value)) {
    for (const item of value) collectShots(item, out);
  } else if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string") out.push({ src: record.src, alt: record.alt });
    for (const item of Object.values(record)) collectShots(item, out);
  }
  return out;
}

const everything = [
  hero,
  intro,
  howIWork,
  aiSection,
  capabilities,
  roles,
  credentials,
  projects,
  site,
  contactLinks,
  navigation,
  pendingAssets,
];

describe("proyectos", () => {
  it("no repite slugs", () => {
    const slugs = projects.map((project) => project.slug);
    const repetidos = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    expect(repetidos).toEqual([]);
  });

  it("usa slugs que sirven como URL", () => {
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("nunca publica un borrador", () => {
    expect(publishedProjects.map((project) => project.status)).not.toContain("draft");
  });

  it("publica solo casos completos", () => {
    expect(publishedProjects.length).toBeGreaterThan(0);

    for (const project of publishedProjects) {
      expect(project.cover.src, `${project.slug}: falta la portada`).toBeTruthy();
      expect(project.seo.title, `${project.slug}: falta seo.title`).toBeTruthy();
      expect(project.seo.description, `${project.slug}: falta seo.description`).toBeTruthy();
      expect(project.blocks.length, `${project.slug}: no tiene bloques`).toBeGreaterThan(0);
    }
  });
});

describe("imágenes", () => {
  it("existen en public/ todas las que el contenido referencia", () => {
    // Se lee el archivo y no el módulo a propósito: así también entra una ruta
    // escrita en un objeto que todavía no se exporta a ninguna vista.
    const referencias = new Set<string>();

    for (const file of sourceFiles(contentDir, /\.ts$/)) {
      const source = readFileSync(file, "utf8");
      const matches = source.matchAll(
        /["'](\/[^"']*\.(?:png|jpe?g|webp|avif|gif|svg))["']/g,
      );
      for (const match of matches) referencias.add(match[1]);
    }

    expect(referencias.size).toBeGreaterThan(0);

    const faltantes = [...referencias].filter((src) => !existsSync(join(publicDir, src)));
    expect(faltantes).toEqual([]);
  });

  it("no deja ninguna sin texto alternativo", () => {
    const sinAlt = collectShots(everything)
      .filter((shot) => typeof shot.alt !== "string" || shot.alt.trim() === "")
      .map((shot) => shot.src);
    expect(sinAlt).toEqual([]);
  });

  it("las referencia como rutas absolutas de public/", () => {
    for (const shot of collectShots(everything)) {
      expect(shot.src.startsWith("/"), `${shot.src} no es una ruta de public/`).toBe(true);
    }
  });
});

describe("tipografía del copy", () => {
  // Con escapes, para que este archivo no contenga los caracteres que prohíbe.
  const guionLargo = /[\u2014\u2013]/;

  it("no usa guiones largos en ningún texto del contenido", () => {
    const conGuion = collectStrings(everything).filter((text) => guionLargo.test(text));
    expect(conGuion).toEqual([]);
  });

  it("tampoco en el copy que quedó escrito en las vistas", () => {
    // El contenido tipado no es la única fuente de texto visible: el microcopy
    // funcional (un 404, un rótulo) vive en el componente. Se descartan los
    // comentarios, que no llegan a pantalla; cortar de más deja pasar algún
    // caso, cortar de menos haría fallar por una nota interna.
    const sinComentarios = (source: string) =>
      source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/.*$/gm, "$1");

    const conGuion = [
      ...sourceFiles(appDir, /\.tsx?$/),
      ...sourceFiles(componentsDir, /\.tsx?$/),
    ].filter((file) => guionLargo.test(sinComentarios(readFileSync(file, "utf8"))));

    expect(conGuion).toEqual([]);
  });
});

describe("mapa del sitio", () => {
  it("no lista una ruta que nadie sirve", () => {
    const slugs = new Set(publishedProjects.map((project) => project.slug));

    for (const entry of sitemap()) {
      expect(entry.url.startsWith(site.url), `${entry.url}: no cuelga de site.url`).toBe(true);

      const path = entry.url.slice(site.url.length) || "/";
      const caso = path.startsWith("/proyectos/") ? path.slice("/proyectos/".length) : null;

      if (caso) {
        expect(slugs.has(caso), `${path}: no es un caso publicado`).toBe(true);
      }

      const page = caso
        ? join(appDir, "proyectos", "[slug]", "page.tsx")
        : join(appDir, path.slice(1), "page.tsx");

      expect(existsSync(page), `${path}: no hay página que servir`).toBe(true);
    }
  });

  it("deja los borradores afuera", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const project of projects.filter((item) => item.status === "draft")) {
      expect(urls).not.toContain(`${site.url}/proyectos/${project.slug}`);
    }
  });

  it("se anuncia en robots con la misma URL base", () => {
    expect(robots().sitemap).toBe(`${site.url}/sitemap.xml`);
  });
});

describe("datos pendientes", () => {
  it("reconoce un marcador", () => {
    expect(isPlaceholder("[EMAIL_PERSONAL]")).toBe(true);
    expect(isPlaceholder("[GITHUB_URL]")).toBe(true);
  });

  it("no confunde un dato real con un marcador", () => {
    expect(isPlaceholder("juan@ejemplo.com.ar")).toBe(false);
    expect(isPlaceholder("https://rienda.ar")).toBe(false);
    expect(isPlaceholder("[email protegido]")).toBe(false);
    expect(isPlaceholder(null)).toBe(false);
    expect(isPlaceholder(undefined)).toBe(false);
  });
});
