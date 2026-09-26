import { otherProjects, projects, resumeData } from "./content";
import { projectTranslations, resumeDataZh } from "./content.zh";
import type { Locale } from "./i18n";

const projectCards = [
  ...projects.map(project => ({ slug: project.slug, title: project.title, discipline: project.discipline, summary: project.summary, status: project.status, year: project.year, stack: project.stack, repoUrl: project.repoUrl })),
  ...otherProjects.map(project => ({ slug: project.slug, title: project.title, discipline: project.discipline, summary: project.summary, status: project.status, year: project.year, stack: project.stack, repoUrl: project.href })),
];

export function getProjectCards(locale: Locale) {
  return locale === "en" ? projectCards : projectCards.map(project => ({ ...project, ...projectTranslations[project.slug] }));
}

export function getResumeData(locale: Locale) {
  return locale === "zh" ? resumeDataZh : resumeData;
}
