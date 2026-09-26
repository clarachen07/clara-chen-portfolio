import ResumePage from "../../../components/ResumePage";
import { getPageMetadata } from "../../../page-metadata";
export const metadata = getPageMetadata("zh", "/resume");
export default function Page() { return <ResumePage locale="zh" />; }
