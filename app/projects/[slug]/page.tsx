import { notFound, redirect } from "next/navigation";
import { getProject, projects } from "../../content";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function LegacyProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  redirect(`/projects#${slug}`);
}
