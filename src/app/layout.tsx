import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { NoScriptFallback } from "@/components/chrome/no-script-fallback";
import { ContactDock } from "@/components/chrome/contact-dock";
import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { SkipLink } from "@/components/chrome/skip-link";
import { MotionRoot } from "@/components/primitives/motion-root";
import { site } from "@/content/site";
import { personJsonLd } from "@/lib/seo";

import "./globals.css";

/**
 * Una sans con carácter para todo el discurso y una monoespaciada solo para
 * metadata. Dos familias, ninguna es la de Rienda: el portfolio conversa con la
 * marca, no la imita.
 */
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, producto, desarrollo e inteligencia artificial`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.linkedin }],
  creator: site.name,
  keywords: [
    "Juan Morales",
    "Rienda",
    "producto",
    "desarrollo",
    "inteligencia artificial",
    "Next.js",
    "Mendoza",
    "Argentina",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "es_AR",
    url: site.url,
    siteName: site.name,
    title: `${site.name}, producto, desarrollo e inteligencia artificial`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, producto, desarrollo e inteligencia artificial`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0f110e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${schibsted.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="bg-night-900 text-paper flex min-h-full flex-col">
        <script
          type="application/ld+json"
          // El JSON-LD se genera desde el contenido tipado, no se escribe a mano.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <NoScriptFallback />
        <MotionRoot>
          <SkipLink />
          <SiteHeader />
          <div className="flex flex-1 flex-col">{children}</div>
          <ContactDock />
          <SiteFooter />
        </MotionRoot>
      </body>
    </html>
  );
}
