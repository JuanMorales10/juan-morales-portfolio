"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MagneticDock } from "@/components/ui/magnetic-dock";
import { realValue, site } from "@/content/site";

/**
 * Accesos fijos abajo: proyectos, CV y las formas de contacto.
 *
 * Va al alcance del pulgar en el teléfono, que es por donde entra la mayoría.
 * Se esconde mientras la sección de contacto está en pantalla, porque ahí ya
 * están los mismos enlaces, y no aparece en /cv, que tiene su propia descarga.
 */
function icon(d: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function open(href: string) {
  if (href.startsWith("/") || href.startsWith("mailto:")) window.location.href = href;
  else window.open(href, "_blank", "noopener,noreferrer");
}

export function ContactDock() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contacto = document.getElementById("contacto");
    if (!contacto) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(contacto);
    return () => {
      observer.disconnect();
      setHidden(false);
    };
  }, [pathname]);

  if (pathname.startsWith("/cv")) return null;

  const email = realValue(site.email);
  const github = realValue(site.github);

  const items = [
    { id: "proyectos", label: "Proyectos", icon: icon("M3 7h18M3 12h18M3 17h12"), onClick: () => open("/proyectos") },
    { id: "cv", label: "CV", icon: icon("M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"), onClick: () => open("/cv") },
    ...(email
      ? [{ id: "correo", label: "Correo", icon: icon("M4 6h16v12H4zM4 7l8 6 8-6"), onClick: () => open(`mailto:${email}`) }]
      : []),
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: icon("M4 4h16v16H4zM8 10v6M8 7v.01M12 16v-6M12 13a2.5 2.5 0 0 1 5 0v3"),
      onClick: () => open(site.linkedin),
    },
    ...(github
      ? [
          {
            id: "github",
            label: "GitHub",
            icon: icon("M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 1.5 5.5 1.8 5.5 1.8a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8.2c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21"),
            onClick: () => open(github),
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Accesos rápidos"
      data-print="hide"
      className={`fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 flex justify-center transition-all duration-500 ${
        hidden ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100"
      }`}
    >
      <MagneticDock items={items} iconSize={44} maxScale={1.45} showLabels variant="glass" />
    </nav>
  );
}
