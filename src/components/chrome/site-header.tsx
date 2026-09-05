"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { easeOutExpo, springSoft } from "@/lib/motion";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Navegación mínima y fija.
 *
 * Se apoya sobre el contenido sin fondo hasta que empieza el scroll; a partir
 * de ahí aparece una hairline y noche translúcida con desenfoque, para que las
 * capturas que pasan por debajo no compitan con los enlaces. En pantallas
 * chicas el menú es un panel completo, con `Escape` para salir.
 *
 * Debajo de `lg`, pegada al borde inferior, va una barra de lectura de 2 px que
 * crece con el scroll de la página. Es informativa, no decorativa: en el
 * teléfono, donde la página es larga y el único gesto es bajar, dice cuánto
 * falta. Por eso con movimiento reducido no se apaga: sigue el scroll sin
 * transición ni resorte. En escritorio no se muestra: esa vista no cambia.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();

  /**
   * El menú guarda en qué ruta se abrió, no un booleano. Así, cuando la
   * navegación cambia de página, queda cerrado por derivación: no hace falta un
   * efecto que sincronice estado con estado.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = useCallback(
    (next: boolean) => setOpenedAt(next ? pathname : null),
    [pathname],
  );

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  const close = useCallback(() => setOpen(false), [setOpen]);

  // El menú abierto bloquea el scroll del documento y se cierra con Escape.
  useEffect(() => {
    if (!open) return;

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbar}px`);
    document.body.dataset.scrollLocked = "true";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      delete document.body.dataset.scrollLocked;
      document.documentElement.style.removeProperty("--scrollbar-width");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <header
      data-print="hide"
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-[var(--hairline)] bg-[color-mix(in_oklab,var(--color-night-900)_80%,transparent)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* La barra vive en este envoltorio y no en el header: así queda bajo la
          fila de navegación aunque el menú móvil abierto haga crecer el header. */}
      <div className="relative">
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            className="group flex items-baseline gap-2.5"
            aria-label={`${site.name}, ir al inicio`}
          >
            <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
            <span className="meta hidden sm:inline">{site.location}</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
              <li className="ml-2">
                <Link
                  href="/cv"
                  className="border-[var(--hairline-strong)] hover:border-jade-glow hover:text-jade-glow inline-flex items-center rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors duration-300"
                >
                  CV
                </Link>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="menu-movil"
            className="border-[var(--hairline-strong)] -mr-1 inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors duration-300 hover:border-jade-glow md:hidden"
          >
            {open ? "Cerrar" : "Menú"}
            <MenuGlyph open={open} />
          </button>
        </div>

        {/* `scaleX` atado directo al valor de scroll: transform puro, sin
            transición. Solo debajo de `lg`: en escritorio no se ve nada nuevo. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="from-jade to-jade-glow pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-linear-to-r lg:hidden"
        />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-movil"
            key="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="border-t border-[var(--hairline)] bg-night-900 md:hidden"
          >
            <nav aria-label="Principal, versión compacta" className="shell py-6">
              <ul className="flex flex-col">
                {[...navigation, { label: "CV", href: "/cv" }].map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * index, ...springSoft }}
                    className="hairline-b last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block py-4 text-[1.375rem] tracking-[-0.02em] text-paper transition-colors duration-300 hover:text-jade-glow"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="text-paper-muted hover:text-paper relative inline-flex items-center rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

/**
 * Dos barras que se cruzan al abrir.
 *
 * Se mueven con `transform`, no interpolando el atributo `d`: Motion no
 * interpola trazados con distinta cantidad de comandos, y pedirle que lo haga
 * rompe el bucle de animación de toda la página.
 */
function MenuGlyph({ open }: { open: boolean }) {
  const bar = {
    transformBox: "fill-box",
    transformOrigin: "center",
  } as const;

  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
      <motion.rect
        x="2"
        y="7.4"
        width="12"
        height="1.2"
        rx="0.6"
        style={bar}
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
        transition={{ duration: 0.3, ease: easeOutExpo }}
      />
      <motion.rect
        x="2"
        y="7.4"
        width="12"
        height="1.2"
        rx="0.6"
        style={bar}
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
        transition={{ duration: 0.3, ease: easeOutExpo }}
      />
    </svg>
  );
}
