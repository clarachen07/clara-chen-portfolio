"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { TerrainController } from "./terrain-types";

type SceneStatus = "waiting" | "ready" | "static" | "fallback";

export function MarsTerrainSection({ children }: { children: ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const controller = useRef<TerrainController | null>(null);
  const pausePreference = useRef(false);
  const [status, setStatus] = useState<SceneStatus>("waiting");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const region = section.current;
    const host = mount.current;
    if (!region || !host) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let generation = 0;
    let started = false;
    let nearby = false;
    let visible = false;
    let scrollFrame = 0;

    function progress() {
      const rect = region!.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      return Math.min(1, Math.max(0, -rect.top / distance));
    }

    function updateScroll() {
      scrollFrame = 0;
      controller.current?.setProgress(progress());
    }

    function handleScroll() {
      if (visible && !scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    }

    async function start() {
      if (cancelled || started || !nearby || motion.matches) return;
      started = true;
      const run = ++generation;
      const fail = () => {
        if (cancelled || run !== generation) return;
        generation += 1;
        controller.current?.dispose();
        controller.current = null;
        setStatus("fallback");
      };
      try {
        const { createTerrainScene } = await import("./terrain-runtime");
        if (cancelled || run !== generation) return;
        const scene = createTerrainScene(host!, fail);
        controller.current = scene;
        scene.setProgress(progress());
        scene.pause(pausePreference.current);
        scene.setVisible(visible);
        await scene.ready;
        if (!cancelled && run === generation) setStatus("ready");
      } catch {
        fail();
      }
    }

    function syncMotion() {
      if (motion.matches) {
        generation += 1;
        controller.current?.dispose();
        controller.current = null;
        started = false;
        setStatus("static");
      } else {
        setStatus("waiting");
        void start();
      }
    }

    const preloadObserver = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      if (nearby) void start();
    }, { rootMargin: "350px" });
    // Observe the full content region: a sticky canvas alone can remain visible
    // after its content has scrolled away.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      controller.current?.setProgress(progress());
      controller.current?.setVisible(visible);
    });
    const resizeObserver = new ResizeObserver(updateScroll);
    syncMotion();
    preloadObserver.observe(region);
    visibilityObserver.observe(region);
    resizeObserver.observe(region);
    motion.addEventListener("change", syncMotion);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelled = true;
      generation += 1;
      cancelAnimationFrame(scrollFrame);
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className="projects-terrain" ref={section} data-nav-theme="sand" data-state={status} data-paused={paused}>
      <div className="terrain-backdrop">
        <picture className="terrain-poster">
          <source media="(max-width: 640px)" srcSet="/scenes/terrain/poster-mobile.webp" />
          {/* A same-camera poster remains visible until all 3D assets are ready. */}
          <img src="/scenes/terrain/poster-desktop.webp" width="1600" height="1000" alt="" loading="lazy" decoding="async" />
        </picture>
        <div className="terrain-mount" ref={mount} aria-hidden="true" />
      </div>
      <div className="terrain-content">{children}</div>
      <div className="terrain-controls" hidden={status !== "ready"}>
          <button
            type="button"
            aria-label={paused ? "Resume landscape motion" : "Pause landscape motion"}
            aria-pressed={paused}
            onClick={() => {
              const next = !pausePreference.current;
              pausePreference.current = next;
              controller.current?.pause(next);
              setPaused(next);
            }}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
            {paused ? "Resume landscape" : "Pause landscape"}
          </button>
      </div>
      <span className="terrain-status" role="status">
        {status === "fallback" ? "Static landscape shown. The interactive landscape is unavailable." : ""}
      </span>
    </div>
  );
}
