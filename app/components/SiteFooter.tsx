import { MarsScene } from "./scenes/SceneView";

export function SiteFooter() {
  return (
    <footer
      className="site-footer site-footer--mars"
      id="contact"
      data-nav-theme="dark"
      aria-labelledby="mars-thought"
    >
      <MarsScene />
      <div className="mars-copy">
        <h2 id="mars-thought">
          To understand
          <br />a little more.
          <span>
            To build something
            <br />that matters.
          </span>
        </h2>
      </div>
    </footer>
  );
}
