import { messages, type Locale } from "../i18n";
import { MarsScene } from "./scenes/SceneView";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = messages[locale].footer;
  return (
    <footer
      className="site-footer site-footer--mars"
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="mars-thought"
    >
      <MarsScene locale={locale} />
      <div className="mars-copy">
        <h2 id="mars-thought">
          {t.understand}
          <br />{t.more}
          <span>
            {t.build}
            <br />{t.matters}
          </span>
        </h2>
      </div>
    </footer>
  );
}
