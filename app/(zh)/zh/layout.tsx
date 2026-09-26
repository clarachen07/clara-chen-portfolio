import type { ReactNode } from "react";
import { SiteDocument, sharedMetadata } from "../../components/SiteDocument";
export const metadata = sharedMetadata;
export default function Layout({ children }: { children: ReactNode }) {
  return <SiteDocument locale="zh">{children}</SiteDocument>;
}
