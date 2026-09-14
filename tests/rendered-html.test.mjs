import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

let workerPromise;

async function getWorker() {
  workerPromise ??= import(
    new URL(`../dist/server/index.js?test=${process.pid}-${Date.now()}`, import.meta.url)
      .href
  ).then((module) => module.default);
  return workerPromise;
}

async function render(pathname = "/") {
  const worker = await getWorker();
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete portfolio route map", async () => {
  const expected = [
    ["/", /aria-label="Clara Chen"/i],
    ["/projects", /Projects built to make difficult systems legible/i],
    ["/resume", /Creator Operations Intern/i],
  ];

  for (const [pathname, content] of expected) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    assert.match(await response.text(), content);
  }

  for (const slug of [
    "llm-post-training-mechanism",
    "typhoon-rainfall",
    "memory-album-diy",
  ]) {
    const response = await render(`/projects/${slug}`);
    assert.ok([307, 308].includes(response.status), slug);
    const location = new URL(response.headers.get("location"), "http://localhost");
    assert.equal(`${location.pathname}${location.hash}`, `/projects#${slug}`);
  }

  assert.equal((await render("/projects/not-a-project")).status, 404);
});

test("homepage joins the editorial artboard to the complete projects landing", async () => {
  const html = await (await render()).text();
  assert.match(html, /class="cc-home-artboard"/);
  assert.match(html, /class="cc-hero-name"/);
  assert.match(html, /A lifelong learner and explorer\./);
  assert.doesNotMatch(html, /One page\. Six working systems\./);
  assert.doesNotMatch(html, /Six concise dossiers across language-model research/i);
  assert.doesNotMatch(html, /Math is the poetry of logic/i);
  assert.doesNotMatch(html, /I explore the space/i);
  assert.doesNotMatch(html, /Explore My Work/i);
  assert.doesNotMatch(html, /Input Space|Latent Manifold|Abstraction Layers|Output Space/i);
  assert.match(html, /class="site-header site-header--light"/);
  assert.match(html, /class="site-brand-name">Clara Chen/);
  assert.doesNotMatch(html, /class="cc-monogram"/);
  assert.match(html, /href="#projects-overview"[^>]*>Projects</i);
  assert.match(html, /href="\/resume"[^>]*>Resume</i);
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/clara-chen-1b11a2419\/" target="_blank" rel="noopener noreferrer"[^>]*>\s*LinkedIn/i);
  assert.doesNotMatch(html, />Contact</i);
  assert.match(html, /GitHub/);
  assert.match(html, /href="#projects-overview"/);
  assert.match(html, /<h2>Projects built to make difficult systems legible\.<\/h2>/i);
  assert.equal((html.match(/class="reveal text-project-card"/g) ?? []).length, 6);
  assert.match(html, /href="\/resume"/);
  assert.doesNotMatch(html, /Start a conversation/i);
  assert.doesNotMatch(html, /Clara Chen · Beijing/);
  assert.doesNotMatch(html, />Email</i);
  assert.doesNotMatch(html, /© 2026/);
  assert.match(html, /To understand/);
  assert.match(html, /To build something/);
  assert.match(html, /class="site-footer site-footer--mars"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /property="og:image" content="https:\/\/clarachen.dev\/og.png"/);
  assert.doesNotMatch(html, /codex-preview|figmacapture|html-to-design\/capture\.js/i);
});

test("resume hides the unavailable PDF and contains only verified anchors", async () => {
  const html = await (await render("/resume")).text();
  assert.match(html, /class="academic-resume-shell"/);
  assert.match(html, /aria-label="Résumé sections"/);
  assert.match(html, /class="academic-resume-brand">Clara Chen/);
  assert.match(html, /href="\/">Home ↗<\/a>/);
  assert.doesNotMatch(html, /All work/i);
  assert.match(html, /Research interests/);
  assert.match(html, /Research &amp; projects/);
  assert.match(html, /Large Language Models · AI Applications · Post-Training · AI Agents · Engineering/);
  assert.match(html, /I am a mathematics undergraduate who is interested in LLM alignment, reasoning, mathematical modeling, and AI applications\./);
  assert.doesNotMatch(html, /<h2 id="current-title">Current<\/h2>/);
  assert.doesNotMatch(html, />Now<\/p>/);
  assert.doesNotMatch(html, /Coursework/);
  assert.doesNotMatch(html, /I care about making technical systems rigorous enough to inspect/i);
  assert.match(html, /Beijing Normal University/);
  assert.match(html, /Jun 2026 — Present/);
  assert.match(html, /Beijing Yongyue Intelligent Technology Co\., Ltd\. \(Loopit\)/);
  assert.match(html, /Jun 2026 — Aug 2026/);
  assert.match(html, /Sep 2024 — Jun 2028/);
  assert.match(html, /17,000\+ member community/);
  assert.match(html, />clarachen07@foxmail\.com<\/a>/);
  assert.match(html, /src="\/resume\/clara-portrait\.jpg"/);
  assert.match(html, /alt="Portrait illustration of Clara Chen"/);
  assert.doesNotMatch(html, /Download PDF/);
});

test("projects consolidates six text-only cards on one page", async () => {
  const html = await (await render("/projects")).text();

  assert.match(html, /<title>Projects — Clara Chen<\/title>/i);
  assert.equal((html.match(/class="reveal text-project-card"/g) ?? []).length, 6);
  assert.match(html, /LLM Post-Training Mechanism Research/);
  assert.match(html, /Typhoon Extreme-Rainfall Modeling/);
  assert.match(html, /Memory Album DIY/);
  assert.match(html, /SiC Infrared Thickness Inversion/);
  assert.match(html, /Limit of RLVR Reproduction/);
  assert.match(html, /Docs as Code/);
  assert.doesNotMatch(html, /src="\/projects\//i);
  assert.match(html, /class="site-footer site-footer--mars"/);
  assert.match(html, /target="_blank" rel="noopener noreferrer"/i);
});

test("ships responsive, deterministic, accessible visual layers", async () => {
  const [css, resumeCss, artwork, content] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/resume/resume.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/home/HomeArtwork.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/content.ts", import.meta.url), "utf8"),
  ]);

  await Promise.all([
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/projects/llm-post-training-results.svg", import.meta.url)),
    access(new URL("../public/projects/typhoon-representative-fields.png", import.meta.url)),
    access(new URL("../public/resume/clara-portrait.jpg", import.meta.url)),
    access(new URL("../public/scenes/mars-poster.webp", import.meta.url)),
    access(new URL("../public/scenes/mars-mobile.webp", import.meta.url)),
    access(new URL("../public/scenes/mars-8k.webp", import.meta.url)),
    access(new URL("../public/scenes/mars-2k.webp", import.meta.url)),
  ]);

  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width:\s*900px\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(resumeCss, /@media \(max-width:\s*640px\)/);
  assert.match(resumeCss, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(resumeCss, /overflow-wrap:\s*anywhere/);
  assert.match(artwork, /viewBox="0 0 1448 1086"/);
  assert.doesNotMatch(artwork, /Math\.random/);
  assert.doesNotMatch(content, /Math\.random/);
});
