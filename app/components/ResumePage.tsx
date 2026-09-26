import Image from "next/image";
import Link from "next/link";
import { getResumeData } from "../localized-content";
import { localizedPath, messages, type Locale } from "../i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import "../resume/resume.css";

function AcademicPortrait({ locale }: { locale: Locale }) {
  return (
    <div className="academic-portrait">
      <Image
        src="/resume/clara-portrait.jpg"
        alt={messages[locale].resume.portrait}
        width={724}
        height={966}
        sizes="(max-width: 640px) 160px, 214px"
        priority
        unoptimized
      />
    </div>
  );
}

function ProfileLinks({ locale }: { locale: Locale }) {
  const resumeData = getResumeData(locale);
  const t = messages[locale].resume;
  return (
    <ul className="academic-profile-links" aria-label={t.contacts}>
      <li><span>{t.locationLabel}</span>{t.location}</li>
      {resumeData.links.map((link) => (
        <li key={link.label}>
          <span>{link.href.startsWith("mailto:") ? t.emailLabel : link.label.slice(0, 3).toUpperCase()}</span>
          <a
            href={link.href}
            {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link.href.startsWith("mailto:") ? link.href.replace("mailto:", "") : link.label}
            {link.href.startsWith("http") ? " ↗" : ""}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ResumeBullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="academic-bullets">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function ResumePage({ locale }: { locale: Locale }) {
  const resumeData = getResumeData(locale);
  const t = messages[locale].resume;
  const sectionLinks = [
    { label: t.profile, href: "#about" },
    { label: t.education, href: "#education" },
    { label: t.experience, href: "#experience" },
    { label: t.research, href: "#projects" },
    { label: t.skills, href: "#skills" },
  ];
  const contact = resumeData.links.find((link) => link.href.startsWith("mailto:"));

  return (
    <main className="academic-resume-page">
      <header className="academic-resume-nav">
        <Link className="academic-resume-brand" href={localizedPath(locale)}>Clara Chen</Link>
        <nav className="academic-resume-nav-links" aria-label={t.sections}>
          {sectionLinks.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
          <Link href={localizedPath(locale)}>{messages[locale].navigation.home} ↗</Link>
        </nav>
        <LanguageSwitch locale={locale} path="/resume" />
      </header>

      <div className="academic-resume-shell">
        <aside className="academic-profile" aria-labelledby="resume-name">
          <AcademicPortrait locale={locale} />
          <h1 id="resume-name">Clara Chen</h1>
          <p className="academic-profile-role">{t.role}</p>
          <p className="academic-profile-school">{t.school}</p>
          <p className="academic-profile-focus">{resumeData.headline}</p>
          <ProfileLinks locale={locale} />
          {resumeData.pdfUrl ? (
            <a className="academic-pdf-link" href={resumeData.pdfUrl} download>{t.download} ↓</a>
          ) : null}
        </aside>

        <article className="academic-resume-content">
          <section className="academic-intro" id="about" aria-labelledby="about-title">
            <p className="academic-kicker">{t.profileKicker}</p>
            <h2 id="about-title">{t.profile}</h2>
            <p className="academic-intro-lead">{resumeData.summary}</p>
          </section>

          <section id="education" aria-labelledby="education-title">
            <p className="academic-kicker">{t.educationKicker}</p>
            <h2 id="education-title">{t.education}</h2>
            <div className="academic-timeline">
              {resumeData.education.map((item) => (
                <article key={item.institution}>
                  <p>{item.dates}</p>
                  <div className="academic-education-copy">
                    <h3>{item.institution}</h3>
                    <p className="academic-timeline-organization">{item.degree}</p>
                    <p className="academic-coursework"><strong>{t.coursework}</strong>{item.coursework.join(" · ")}</p>
                    <ul className="academic-education-honors">
                      {item.honors.map((honor) => <li key={honor}>{honor}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" aria-labelledby="experience-title">
            <p className="academic-kicker">{t.experienceKicker}</p>
            <h2 id="experience-title">{t.experience}</h2>
            <div className="academic-timeline">
              {resumeData.experience.map((item) => (
                <article key={`${item.organization}-${item.role}`}>
                  <p>{item.dates}</p>
                  <div className="academic-experience-copy">
                    <h3>{item.role}</h3>
                    <p className="academic-timeline-organization">{item.organization} · {item.type}</p>
                    <ResumeBullets items={item.bullets} />
                    <p className="academic-timeline-stack">{item.stack.join(" · ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="projects" aria-labelledby="projects-title">
            <p className="academic-kicker">{messages[locale].projects.selected}</p>
            <h2 id="projects-title">{t.researchHeading}</h2>
            <div className="academic-project-list">
              {resumeData.selectedProjects.map((project) => (
                <article className="academic-project" key={project.slug}>
                  <p className="academic-project-meta"><span>{project.year}</span>{project.discipline}</p>
                  <h3>{project.title}</h3>
                  <ResumeBullets items={project.bullets} />
                  <p className="academic-project-stack">{project.stack.join(" · ")}</p>
                  {project.links?.length ? (
                    <div className="academic-project-actions">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section id="skills" aria-labelledby="skills-title">
            <p className="academic-kicker">{t.skillsKicker}</p>
            <h2 id="skills-title">{t.skills}</h2>
            <div className="academic-skills">
              {resumeData.skills.map((group) => (
                <div key={group.category}><h3>{group.category}</h3><p>{group.items.join(" · ")}</p></div>
              ))}
            </div>
          </section>
        </article>
      </div>

      <footer className="academic-resume-footer" id="contact">
        <span>Clara Chen · {t.city}</span>
        {contact ? <a href={contact.href}>{resumeData.contactLabel} ↗</a> : null}
      </footer>
    </main>
  );
}
