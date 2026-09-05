import type { Metadata } from "next";

import { CvDocument } from "@/components/cv/cv-document";
import { site } from "@/content/site";

const description = `Recorrido profesional, formación y capacidades de ${site.name}. ${site.role}, ${site.location}. Se imprime y se guarda como PDF desde el navegador.`;

export const metadata: Metadata = {
  title: "CV",
  description,
  alternates: { canonical: "/cv" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "profile",
    locale: "es_AR",
    url: `${site.url}/cv`,
    siteName: site.name,
    title: `CV · ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `CV · ${site.name}`,
    description,
  },
};

export default function CvPage() {
  return (
    <main id="contenido">
      <CvDocument />
    </main>
  );
}
