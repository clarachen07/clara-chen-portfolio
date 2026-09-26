"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { localizedPath, messages, type Locale, type PagePath } from "../i18n";

function subscribeLocation(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

const locationSuffix = () => window.location.search + window.location.hash;
const serverSuffix = () => "";

export function LanguageSwitch({ locale, path }: { locale: Locale; path: PagePath }) {
  const suffix = useSyncExternalStore(subscribeLocation, locationSuffix, serverSuffix);

  return (
    <div className="language-switch" role="group" aria-label={messages[locale].navigation.language}>
      {(["en", "zh"] as const).map((language, index) => (
        <span className="language-switch-option" key={language}>
          {index > 0 ? <span className="language-switch-divider" aria-hidden="true">|</span> : null}
          <Link
            href={localizedPath(language, path) + suffix}
            hrefLang={language === "zh" ? "zh-CN" : "en"}
            lang={language === "zh" ? "zh-CN" : "en"}
            aria-label={language === "en" ? "Switch to English" : "切换为中文"}
            aria-current={language === locale ? "page" : undefined}
            prefetch={false}
            onClick={(event) => {
              if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              // Each language has its own root document. A document navigation
              // keeps html.lang, metadata, and browser history in agreement.
              if (language !== locale) window.location.assign(localizedPath(language, path) + locationSuffix());
            }}
          >
            {language === "en" ? "EN" : "中文"}
          </Link>
        </span>
      ))}
    </div>
  );
}
