import type { Metadata } from "next";
import { localizedPath, messages, type Locale, type PagePath } from "./i18n";
import { getResumeData } from "./localized-content";

export function getPageMetadata(locale: Locale, path: PagePath): Metadata {
  const copy = messages[locale];
  const title = path === "/" ? copy.home.title : `${path === "/resume" ? copy.resume.title : copy.projects.title} — Clara Chen`;
  const description = path === "/" ? copy.home.description : path === "/resume" ? getResumeData(locale).summary : copy.projects.description;
  const url = localizedPath(locale, path);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { en: localizedPath("en", path), "zh-CN": localizedPath("zh", path), "x-default": localizedPath("en", path) },
    },
    openGraph: {
      type: "website", url, siteName: "Clara Chen", title, description,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      alternateLocale: locale === "zh" ? "en_US" : "zh_CN",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: copy.home.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
