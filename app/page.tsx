import "./original-home.css";
import { ArtworkBack, ArtworkStructure } from "./components/home/HomeArtwork";
import { ProjectsLanding } from "./components/ProjectsLanding";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { homeContent } from "./home-content";

function HeroName() {
  return (
    <h1 className="cc-hero-name" id="home-title" aria-label="Clara Chen">
      <span className="cc-hero-first">{homeContent.name.first}</span>
      <span className="cc-hero-last">{homeContent.name.last}</span>
      <span className="cc-hero-dot" aria-hidden="true" />
    </h1>
  );
}

function HomeTagline() {
  return <p className="cc-home-tagline">A lifelong learner and explorer.</p>;
}

export default function Home() {
  return (
    <main className="home-page">
      <SiteHeader projectsHref="#projects-overview" />
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
          <HomeTagline />
        </section>
      </div>
      <ProjectsLanding embedded />
      <SiteFooter />
    </main>
  );
}
