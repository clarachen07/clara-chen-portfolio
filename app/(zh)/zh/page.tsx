import HomePage from "../../components/HomePage";
import { getPageMetadata } from "../../page-metadata";
export const metadata = getPageMetadata("zh", "/");
export default function Page() { return <HomePage locale="zh" />; }
