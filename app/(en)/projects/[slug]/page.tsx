import LegacyProjectPage from "../../../components/LegacyProjectPage";
export { generateStaticParams } from "../../../components/LegacyProjectPage";
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return LegacyProjectPage({ locale: "en", params });
}
