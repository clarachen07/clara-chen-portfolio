"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const linkedInUrl = "https://www.linkedin.com/in/clara-chen-1b11a2419/";

export function SiteHeader({
  showBrand = true,
  projectsHref = "/projects",
}: {
  showBrand?: boolean;
  projectsHref?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "sand">("light");
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
          const nextTheme = visible.target.getAttribute("data-nav-theme");
          setTheme(nextTheme === "dark" || nextTheme === "sand" ? nextTheme : "light");
        }
      },
      { rootMargin: "-8% 0px -82% 0px", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuToggle.current?.focus({ preventScroll: true });
      }
      if (event.key === "Tab") {
        const items = Array.from(header.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
          .filter((item) => item.tabIndex >= 0 && item.getClientRects().length > 0);
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || !header.current?.contains(document.activeElement))) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !header.current?.contains(document.activeElement))) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.dataset.menuOpen = menuOpen ? "true" : "false";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      delete document.body.dataset.menuOpen;
    };
  }, [menuOpen]);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)");
    const closeOnDesktop = () => {
      if (!mobile.matches) setMenuOpen(false);
    };
    mobile.addEventListener("change", closeOnDesktop);
    return () => mobile.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header
      ref={header}
      className={`site-header site-header--${theme}${menuOpen ? " is-open" : ""}`}
    >
      {showBrand ? (
        <Link className="site-brand" href="/" aria-label="Clara Chen — home" onClick={() => setMenuOpen(false)}>
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
        ref={menuToggle}
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
        inert={!menuOpen}
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
