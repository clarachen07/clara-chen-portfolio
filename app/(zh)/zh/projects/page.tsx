import ProjectsPage from "../../../components/ProjectsPage";
import { getPageMetadata } from "../../../page-metadata";
export const metadata = getPageMetadata("zh", "/projects");
export default function Page() { return <ProjectsPage locale="zh" />; }
