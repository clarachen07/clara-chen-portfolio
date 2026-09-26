import ProjectsPage from "../../components/ProjectsPage";
import { getPageMetadata } from "../../page-metadata";
export const metadata = getPageMetadata("en", "/projects");
export default function Page() { return <ProjectsPage locale="en" />; }
