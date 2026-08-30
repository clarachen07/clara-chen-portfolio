import type { Metadata } from "next";
import { ProjectsLanding } from "../components/ProjectsLanding";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected research, mathematical modeling, and product work by Clara Chen.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <SiteHeader />
      <ProjectsLanding />
      <SiteFooter />
    </main>
  );
}
