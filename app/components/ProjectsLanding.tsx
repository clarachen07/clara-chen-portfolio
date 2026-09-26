import { Reveal } from "./Reveal";
import { MarsTerrainSection } from "./scenes/MarsTerrainSection";
import { getProjectCards } from "../localized-content";
import { messages, type Locale } from "../i18n";

export function ProjectsLanding({ embedded = false, locale }: { embedded?: boolean; locale: Locale }) {
  const t = messages[locale].projects;
  const title = t.heading;
  const projectCards = getProjectCards(locale);

  return (
    <MarsTerrainSection locale={locale}>
      <section
        className="page-hero projects-hero"
        id="projects-overview"
        data-nav-theme="sand"
      >
        <p className="page-eyebrow">{t.archive}</p>
        {embedded ? <h2>{title}</h2> : <h1>{title}</h1>}
      </section>

      <section className="projects-text-archive" data-nav-theme="sand" aria-label={t.selected}>
        <div className="projects-text-heading">
          <p>{t.selected}</p>
        </div>

        <div className="text-project-grid">
          {projectCards.map((project, index) => (
            <Reveal className="text-project-card" id={project.slug} key={project.slug}>
              <div className="text-project-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.year}</span>
              </div>
              <p className="text-project-discipline">{project.discipline}</p>
              <h3>{project.title}</h3>
              <p className="text-project-summary">{project.summary}</p>
              <p className="text-project-stack">{project.stack.join(" · ")}</p>
              <div className="text-project-card-footer">
                <span><i aria-hidden="true" />{project.status}</span>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  {t.repository} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </MarsTerrainSection>
  );
}
