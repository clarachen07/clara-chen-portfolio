import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "../content";
import { projects, resumeData } from "../content";
import "./resume.css";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Education, experience, research, and technical work by Clara Chen.",
  alternates: { canonical: "/resume" },
};

const sectionLinks = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
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

function ProjectThumbnail({ project }: { project: Project }) {
  const asset = project.assets[0];

  if (!asset) {
    return (
      <div className="academic-project-placeholder" aria-label="Memory Album DIY theme system">
        <span>ROSE</span><span>PAPER</span><span>NIGHT</span>
        <i>Browser → ZIP</i>
      </div>
    );
  }

  return (
    <div className="academic-project-image">
      <Image
        src={asset.src}
        alt={asset.alt}
        width={project.slug === "typhoon-rainfall" ? 990 : 1200}
        height={project.slug === "typhoon-rainfall" ? 601 : 630}
        sizes="(max-width: 700px) 100vw, 290px"
        unoptimized
      />
    </div>
  );
}

export default function ResumePage() {
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
          <p className="academic-profile-focus">
            Large Language Models · AI Applications · Post-Training · AI Agents · Engineering
          </p>
          <ProfileLinks />
          {resumeData.pdfUrl ? (
            <a className="academic-pdf-link" href={resumeData.pdfUrl} download>Download CV ↓</a>
          ) : null}
        </aside>

        <article className="academic-resume-content">
          <section className="academic-intro" id="about" aria-labelledby="about-title">
            <p className="academic-kicker">Research profile · 2026</p>
            <h2 id="about-title">About me</h2>
            <p className="academic-intro-lead">{resumeData.summary}</p>
            <p>
              My current work connects mathematical reasoning, post-training evaluation,
              applied AI engineering, and creator operations.
            </p>
          </section>

          <section id="research" aria-labelledby="research-title">
            <p className="academic-kicker">Fields of inquiry</p>
            <h2 id="research-title">Research interests</h2>
            <div className="academic-interest-grid">
              <div><span>01</span><h3>LLM Reasoning</h3><p>Post-training, alignment, and behavioral evaluation.</p></div>
              <div><span>02</span><h3>Mathematical Modeling</h3><p>Interpretable models for physical and geospatial systems.</p></div>
              <div><span>03</span><h3>AI4Finance</h3><p>Quantitative methods and trustworthy analytical products.</p></div>
              <div><span>04</span><h3>Product Systems</h3><p>Technical storytelling and privacy-first interaction design.</p></div>
            </div>
          </section>

          <section id="projects" aria-labelledby="projects-title">
            <p className="academic-kicker">Selected work</p>
            <h2 id="projects-title">Research &amp; projects</h2>
            <div className="academic-project-list">
              {projects.map((project) => (
                <article className="academic-project" key={project.slug}>
                  <ProjectThumbnail project={project} />
                  <div className="academic-project-copy">
                    <p className="academic-project-meta"><span>{project.year}</span>{project.discipline}</p>
                    <h3><Link href={`/projects#${project.slug}`}>{project.title}</Link></h3>
                    <p>{project.summary}</p>
                    <dl>
                      {project.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
                      ))}
                    </dl>
                    <div className="academic-project-actions">
                      <Link href={`/projects#${project.slug}`}>View in projects →</Link>
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Repository ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" aria-labelledby="experience-title">
            <p className="academic-kicker">Professional</p>
            <h2 id="experience-title">Experience</h2>
            <div className="academic-timeline">
              {resumeData.experience.map((item) => (
                <article key={`${item.organization}-${item.role}`}>
                  <p>{item.dates}</p>
                  <div className="academic-experience-copy">
                    <h3>{item.role}</h3>
                    <p className="academic-timeline-organization">{item.organization} · {item.type}</p>
                    <p className="academic-timeline-summary">{item.summary}</p>
                    <p className="academic-timeline-impact"><strong>Impact</strong>{item.impact}</p>
                    <p className="academic-timeline-stack">{item.stack.join(" · ")}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="education" aria-labelledby="education-title">
            <p className="academic-kicker">Academic</p>
            <h2 id="education-title">Education</h2>
            <div className="academic-timeline">
              {resumeData.education.map((item) => (
                <article key={item.institution}>
                  <p>{item.dates}</p>
                  <div className="academic-education-copy">
                    <h3>{item.institution}</h3>
                    <p className="academic-timeline-organization">{item.degree}</p>
                    <ul className="academic-education-honors">
                      {item.honors.map((honor) => <li key={honor}>{honor}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="skills" aria-labelledby="skills-title">
            <p className="academic-kicker">Methods</p>
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
        <a href="mailto:clarachen07@foxmail.com">Open to thoughtful collaborations ↗</a>
      </footer>
    </main>
  );
}
