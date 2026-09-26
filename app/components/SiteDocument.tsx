import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Locale } from "../i18n";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "../globals.css";
import "../language.css";

export const sharedMetadata: Metadata = {
  metadataBase: new URL("https://clarachen.dev"),
  icons: { icon: "/favicon.svg" },
};

export function SiteDocument({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <html lang={locale === "zh" ? "zh-CN" : "en"}><body>{children}</body></html>;
}
