import type { Locale } from "../i18n";
import { ProjectsLanding } from "./ProjectsLanding";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export default function ProjectsPage({ locale }: { locale: Locale }) {
  return (
    <main className="projects-page">
      <SiteHeader locale={locale} path="/projects" />
      <ProjectsLanding locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
