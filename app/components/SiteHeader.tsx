"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const linkedInUrl = "https://www.linkedin.com/in/clara-chen-1b11a2419/";

export function SiteHeader({
  showBrand = true,
  projectsHref = "/projects",
}: {
  showBrand?: boolean;
  projectsHref?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigationItems = [
    { label: "Projects", href: projectsHref, external: false },
    { label: "Resume", href: "/resume", external: false },
    { label: "LinkedIn", href: linkedInUrl, external: true },
  ] as const;

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]"),
    );

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setTheme(
            visible.target.getAttribute("data-nav-theme") === "dark"
              ? "dark"
              : "light",
          );
        }
      },
      { rootMargin: "-8% 0px -82% 0px", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.dataset.menuOpen = menuOpen ? "true" : "false";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header site-header--${theme}${menuOpen ? " is-open" : ""}`}
    >
      {showBrand ? (
        <Link className="site-brand" href="/" aria-label="Clara Chen — home">
          <span className="site-brand-name">Clara Chen</span>
        </Link>
      ) : (
        <span className="site-brand-spacer" aria-hidden="true" />
      )}

      <nav className="site-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          if (item.external) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label} <span aria-hidden="true">↗</span>
              </a>
            );
          }

          return item.href.startsWith("#") ? (
            <a key={item.label} href={item.href}>{item.label}</a>
          ) : (
            <Link key={item.label} href={item.href}>{item.label}</Link>
          );
        })}
        <a href="https://github.com/clarachen07" target="_blank" rel="noopener noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <button
        className="site-menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
      </button>

      <nav
        className="site-mobile-nav"
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navigationItems.map((item) => {
          const sharedProps = {
            tabIndex: menuOpen ? 0 : -1,
            onClick: () => setMenuOpen(false),
          };

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                {...sharedProps}
              >
                {item.label} ↗
              </a>
            );
          }

          return item.href.startsWith("#") ? (
            <a key={item.label} href={item.href} {...sharedProps}>{item.label}</a>
          ) : (
            <Link key={item.label} href={item.href} {...sharedProps}>{item.label}</Link>
          );
        })}
        <a
          href="https://github.com/clarachen07"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
