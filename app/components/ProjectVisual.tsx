import Image from "next/image";
import type { Project } from "../content";

export function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.slug === "memory-album-diy") {
    return (
      <div className={`project-visual album-visual${compact ? " is-compact" : ""}`} aria-label="Memory Album DIY theme system">
        <div className="album-panel album-panel--rose"><span>Rose Orbit</span><i /></div>
        <div className="album-panel album-panel--paper"><span>Paper Scrapbook</span><i /></div>
        <div className="album-panel album-panel--midnight"><span>Midnight Gallery</span><i /></div>
        <p><strong>Local only</strong><span>Browser → ZIP → Anywhere</span></p>
      </div>
    );
  }

  const asset = project.assets[0];
  return (
    <figure className={`project-visual project-figure${compact ? " is-compact" : ""}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={project.slug === "typhoon-rainfall" ? 2970 : 1200}
        height={project.slug === "typhoon-rainfall" ? 1803 : 630}
        sizes={compact ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 100vw, 50vw"}
        unoptimized
      />
      <figcaption>{project.discipline}</figcaption>
    </figure>
  );
}
