import { Reveal } from "./Reveal";
import { otherProjects, projects } from "../content";

const projectCards = [
  ...projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    discipline: project.discipline,
    summary: project.summary,
    status: project.status,
    year: project.year,
    stack: project.stack,
    repoUrl: project.repoUrl,
  })),
  ...otherProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    discipline: project.discipline,
    summary: project.summary,
    status: project.status,
    year: project.year,
    stack: project.stack,
    repoUrl: project.href,
  })),
] as const;

export function ProjectsLanding({ embedded = false }: { embedded?: boolean }) {
  const title = "Projects built to make difficult systems legible.";

  return (
    <>
      <section
        className="page-hero projects-hero"
        id="projects-overview"
        data-nav-theme="light"
      >
        <p className="page-eyebrow">Project archive · 2025—2026</p>
        {embedded ? <h2>{title}</h2> : <h1>{title}</h1>}
      </section>

      <section className="projects-text-archive" data-nav-theme="light" aria-label="Selected work">
        <div className="projects-text-heading">
          <p>Selected work</p>
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
                  Repository <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
