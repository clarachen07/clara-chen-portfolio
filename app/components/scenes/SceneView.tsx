"use client";

import { messages, type Locale } from "../../i18n";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MarsAction, MarsController } from "./types";

export function MarsScene({ locale }: { locale: Locale }) {
  const t = messages[locale].scenes;
  const mount = useRef<HTMLDivElement>(null);
  const controller = useRef<MarsController | null>(null);
  const [status, setStatus] = useState<"waiting" | "ready" | "fallback">("waiting");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = mount.current;
    if (!element) return;

    let cancelled = false;
    let started = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setPaused(motion.matches);
      controller.current?.pause(motion.matches);
    };
    const fail = () => {
      if (cancelled) return;
      controller.current?.dispose();
      controller.current = null;
      setStatus("fallback");
    };

    syncMotion();
    motion.addEventListener("change", syncMotion);
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        try {
          const { createMarsScene } = await import("./runtime");
          if (cancelled) return;
          const scene = createMarsScene(element, fail);
          if (cancelled) {
            scene.dispose();
            return;
          }
          controller.current = scene;
          scene.pause(motion.matches);
          await scene.ready;
          if (!cancelled) setStatus("ready");
        } catch {
          fail();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      motion.removeEventListener("change", syncMotion);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  function action(value: MarsAction) {
    controller.current?.action(value);
  }

  return (
    <div className="mars-scene" data-state={status} data-paused={paused}>
      <picture className="mars-poster">
        <source media="(max-width: 640px)" srcSet="/scenes/mars-mobile.webp" />
        <Image
          src="/scenes/mars-poster.webp"
          alt=""
          width={1440}
          height={1000}
          loading="lazy"
          unoptimized
        />
      </picture>
      <div
        ref={mount}
        className="mars-mount"
        role="group"
        aria-label={t.marsInstructions}
        tabIndex={status === "ready" ? 0 : -1}
        onKeyDown={(event) => {
          const keys: Record<string, MarsAction> = {
            ArrowLeft: "left",
            ArrowRight: "right",
            ArrowUp: "up",
            ArrowDown: "down",
            "+": "closer",
            "=": "closer",
            "-": "farther",
            Home: "reset",
          };
          const value = keys[event.key];
          if (!value) return;
          event.preventDefault();
          action(value);
        }}
      />
      <div className="mars-controls" hidden={status !== "ready"}>
        <span aria-hidden="true" />
        <button
          type="button"
          aria-label={paused ? t.marsPlay : t.marsPause}
          aria-pressed={paused}
          onClick={() => {
            const next = !paused;
            setPaused(next);
            controller.current?.pause(next);
          }}
        >
          {paused ? "▷" : "Ⅱ"}
        </button>
        <button type="button" aria-label={t.zoomIn} onClick={() => action("closer")}>+</button>
        <button type="button" aria-label={t.zoomOut} onClick={() => action("farther")}>−</button>
        <button type="button" aria-label={t.marsReset} onClick={() => action("reset")}>↺</button>
      </div>
      <span className="mars-scene-status" role="status">
        {status === "fallback" ? t.marsFallback : ""}
      </span>
    </div>
  );
}
