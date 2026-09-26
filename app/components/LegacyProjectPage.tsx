import { localizedPath, type Locale } from "../i18n";
import { notFound, redirect } from "next/navigation";
import { getProject, projects } from "../content";

type ProjectPageProps = { params: Promise<{ slug: string }>; locale: Locale };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function LegacyProjectPage({ params, locale }: ProjectPageProps) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return redirect(`${localizedPath(locale, "/projects")}#${slug}`);
}
