import { messages, type Locale } from "../i18n";
import "../original-home.css";
import { ArtworkBack, ArtworkStructure } from "./home/HomeArtwork";
import { ProjectsLanding } from "./ProjectsLanding";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { homeContent } from "../home-content";

function HeroName() {
  return (
    <h1 className="cc-hero-name" id="home-title" aria-label="Clara Chen">
      <span className="cc-hero-first">{homeContent.name.first}</span>
      <span className="cc-hero-last">{homeContent.name.last}</span>
      <span className="cc-hero-dot" aria-hidden="true" />
    </h1>
  );
}

function HomeTagline({ locale }: { locale: Locale }) {
  return <p className="cc-home-tagline">{messages[locale].home.tagline}</p>;
}

export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <main className="home-page">
      <SiteHeader locale={locale} path="/" projectsHref="#projects-overview" />
      <div className="cc-home-shell">
        <section
          className="cc-home-artboard"
          id="home"
          aria-labelledby="home-title"
          data-nav-theme="light"
        >
          <ArtworkBack />
          <HeroName />
          <ArtworkStructure />
          <HomeTagline locale={locale} />
        </section>
      </div>
      <ProjectsLanding locale={locale} embedded />
      <SiteFooter locale={locale} />
    </main>
  );
}
