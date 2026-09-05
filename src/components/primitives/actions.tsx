"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useCallback } from "react";

import { springSnappy, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "quiet";

/**
 * Sobre noche el jade no funciona como relleno de botón (queda en 2:1 con el
 * texto). El primario es papel con texto noche, la inversión exacta del resto
 * de la página, y al pasar el puntero se enciende en jade-glow.
 */
const variantClass: Record<Variant, string> = {
  primary:
    "bg-paper text-night-900 hover:bg-jade-glow border border-transparent",
  secondary:
    "border border-[var(--hairline-strong)] text-paper hover:border-jade-glow hover:text-jade-glow bg-transparent",
  quiet: "text-paper-muted hover:text-paper border border-transparent",
};

/**
 * Botón de acción. Sube dos píxeles al pasar el puntero y se hunde apenas al
 * apretar: alcanza para que se sienta físico sin que el layout se mueva.
 */
export function ActionLink({
  href,
  children,
  variant = "primary",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  /**
   * Quedó de la v1, cuando había secciones claras y oscuras. En la v2 todo es
   * noche y no cambia nada; se conserva para no romper a quien lo pasa.
   */
  onSurfaceInk?: boolean;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5",
    "text-[0.9375rem] font-medium transition-colors duration-300",
    variantClass[variant],
    className,
  );

  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { y: 0, scale: 0.98 },
    transition: springSoft,
  } as const;

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...motionProps}
      >
        {children}
        <ArrowUpRight />
      </motion.a>
    );
  }

  return (
    <MotionLink href={href} className={classes} {...motionProps}>
      {children}
      <ArrowRight />
    </MotionLink>
  );
}

/**
 * Enlace de texto cuyo subrayado crece desde el borde por el que entró el
 * puntero. Es un detalle chico, pero es la diferencia entre un sitio que
 * responde y uno que solo cambia de color. Hereda el color del texto (papel).
 */
export function DirectionalLink({
  href,
  children,
  external = false,
  className,
  printUrl,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
  /** Se imprime entre paréntesis en la versión papel. */
  printUrl?: string;
}) {
  const handlePointerEnter = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const fromLeft = event.clientX - bounds.left < bounds.width / 2;
    target.style.setProperty("--underline-origin", fromLeft ? "0%" : "100%");
  }, []);

  const classes = cn("link-underline inline transition-colors duration-300", className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onPointerEnter={handlePointerEnter}
        data-print-url={printUrl}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onPointerEnter={handlePointerEnter}
      data-print-url={printUrl}
    >
      {children}
    </Link>
  );
}

/** Botón sin navegación, mismo lenguaje físico que `ActionLink`. */
export function ActionButton({
  children,
  onClick,
  variant = "secondary",
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5",
        "cursor-pointer text-[0.9375rem] font-medium transition-colors duration-300",
        variantClass[variant],
        className,
      )}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={springSnappy}
    >
      {children}
    </motion.button>
  );
}

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}
