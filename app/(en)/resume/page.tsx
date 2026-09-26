import ResumePage from "../../components/ResumePage";
import { getPageMetadata } from "../../page-metadata";
export const metadata = getPageMetadata("en", "/resume");
export default function Page() { return <ResumePage locale="en" />; }
