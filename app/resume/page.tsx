import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { resumeData } from "../content";
import "./resume.css";

export const metadata: Metadata = {
  title: "Résumé",
  description: resumeData.summary,
  alternates: { canonical: "/resume" },
};

const sectionLinks = [
  { label: "Profile", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#projects" },
  { label: "Skills", href: "#skills" },
] as const;

function AcademicPortrait() {
  return (
    <div className="academic-portrait">
      <Image
        src="/resume/clara-portrait.jpg"
        alt="Portrait illustration of Clara Chen"
        width={724}
        height={966}
        sizes="(max-width: 640px) 160px, 214px"
        priority
        unoptimized
      />
    </div>
  );
}

function ProfileLinks() {
  return (
    <ul className="academic-profile-links" aria-label="Contact and profile links">
      <li><span>LOC</span>Beijing, China</li>
      {resumeData.links.map((link) => (
        <li key={link.label}>
          <span>{link.label.slice(0, 3).toUpperCase()}</span>
          <a
            href={link.href}
            {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link.label === "Email" ? link.href.replace("mailto:", "") : link.label}
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

export default function ResumePage() {
  const contact = resumeData.links.find((link) => link.label === "Email");

  return (
    <main className="academic-resume-page">
      <header className="academic-resume-nav">
        <Link className="academic-resume-brand" href="/">Clara Chen</Link>
        <nav className="academic-resume-nav-links" aria-label="Résumé sections">
          {sectionLinks.map((item) => <a key={item.label} href={item.href}>{item.label}</a>)}
          <Link href="/">Home ↗</Link>
        </nav>
      </header>

      <div className="academic-resume-shell">
        <aside className="academic-profile" aria-labelledby="resume-name">
          <AcademicPortrait />
          <h1 id="resume-name">Clara Chen</h1>
          <p className="academic-profile-role">Mathematics Undergraduate</p>
          <p className="academic-profile-school">Beijing Normal University</p>
          <p className="academic-profile-focus">{resumeData.headline}</p>
          <ProfileLinks />
          {resumeData.pdfUrl ? (
            <a className="academic-pdf-link" href={resumeData.pdfUrl} download>Download CV ↓</a>
          ) : null}
        </aside>

        <article className="academic-resume-content">
          <section className="academic-intro" id="about" aria-labelledby="about-title">
            <p className="academic-kicker">Internship profile · Class of 2028</p>
            <h2 id="about-title">Profile</h2>
            <p className="academic-intro-lead">{resumeData.summary}</p>
          </section>

          <section id="education" aria-labelledby="education-title">
            <p className="academic-kicker">Mathematical foundations</p>
            <h2 id="education-title">Education</h2>
            <div className="academic-timeline">
              {resumeData.education.map((item) => (
                <article key={item.institution}>
                  <p>{item.dates}</p>
                  <div className="academic-education-copy">
                    <h3>{item.institution}</h3>
                    <p className="academic-timeline-organization">{item.degree}</p>
                    <p className="academic-coursework"><strong>Selected coursework</strong>{item.coursework.join(" · ")}</p>
                    <ul className="academic-education-honors">
                      {item.honors.map((honor) => <li key={honor}>{honor}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" aria-labelledby="experience-title">
            <p className="academic-kicker">Data &amp; systems</p>
            <h2 id="experience-title">Experience</h2>
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
            <p className="academic-kicker">Selected work</p>
            <h2 id="projects-title">Research &amp; modeling</h2>
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
            <p className="academic-kicker">Technical toolkit</p>
            <h2 id="skills-title">Skills</h2>
            <div className="academic-skills">
              {resumeData.skills.map((group) => (
                <div key={group.category}><h3>{group.category}</h3><p>{group.items.join(" · ")}</p></div>
              ))}
            </div>
          </section>
        </article>
      </div>

      <footer className="academic-resume-footer" id="contact">
        <span>Clara Chen · Beijing</span>
        {contact ? <a href={contact.href}>{resumeData.contactLabel} ↗</a> : null}
      </footer>
    </main>
  );
}
