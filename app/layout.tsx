import type { Metadata } from "next";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://clarachen.dev"),
  title: {
    default: "Clara Chen — Mathematics, AI & Product",
    template: "%s — Clara Chen",
  },
  description:
    "Clara Chen is a mathematics undergraduate researching LLM reasoning, mathematical modeling, and useful AI products.",
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Clara Chen",
    title: "Clara Chen — Mathematics, AI & Product",
    description:
      "Research in LLM reasoning, mathematical modeling, and useful AI products.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Clara Chen — Mathematics × AI × Product" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clara Chen — Mathematics, AI & Product",
    description: "Research in LLM reasoning, mathematical modeling, and useful AI products.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
