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
    ["/projects", /I turn questions into models, tools, and experiences/i],
    ["/resume", /Creator Operations Intern/i],
    ["/zh", /终身学习，不断探索/],
    ["/zh/projects", /将问题转化为模型、工具与体验/],
    ["/zh/resume", /创作者运营实习生/],
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
    for (const prefix of ["", "/zh"]) {
      const response = await render(`${prefix}/projects/${slug}`);
      assert.ok([307, 308].includes(response.status), `${prefix}/${slug}`);
      const location = new URL(response.headers.get("location"), "http://localhost");
      assert.equal(`${location.pathname}${location.hash}`, `${prefix}/projects#${slug}`);
    }
  }

  for (const path of ["/projects/not-a-project", "/zh/projects/not-a-project", "/zh/not-a-page"]) {
    assert.equal((await render(path)).status, 404);
  }
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
  assert.match(html, /<h2>I turn questions into models, tools, and experiences\.<\/h2>/i);
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

test("resume renders its curated entries in order with valid links and no unavailable PDF", async () => {
  const html = await (await render("/resume")).text();
  assert.match(html, /class="academic-resume-shell"/);
  assert.match(html, /aria-label="Résumé sections"/);
  assert.match(html, /class="academic-resume-brand">Clara Chen/);
  assert.match(html, /href="\/">Home(?:<!-- -->)? ↗<\/a>/);
  assert.doesNotMatch(html, /All work/i);
  assert.match(html, /<title>Résumé — Clara Chen<\/title>/);
  assert.match(html, /LLM Reasoning &amp; Post-Training \| AI4Finance \| Quant \| Agent/);
  assert.match(html, /Selected coursework/);
  assert.doesNotMatch(html, /Research interests|Memory Album DIY|llm-post-training-results\.svg/);
  const sections = [...html.matchAll(/<section[^>]+id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sections, ["about", "education", "experience", "projects", "skills"]);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `Missing anchor: ${target}`);
  }
  assert.equal((html.match(/class="academic-project"/g) ?? []).length, 3);
  const projectTitles = ["LLM Post-Training &amp; Statistical Evaluation", "Typhoon Extreme-Rainfall Modeling", "Semiconductor Thickness Estimation"];
  let previousIndex = -1;
  for (const title of projectTitles) {
    const index = html.indexOf(`<h3>${title}</h3>`);
    assert.ok(index > previousIndex, `Missing or out-of-order project: ${title}`);
    previousIndex = index;
  }
  for (const repo of ["llm-post-training-mechanism", "limit-of-rlvr-qwen7b-math500-reproduction", "typhoon_rainfall_project", "cumcm-2025-sic-infrared-thickness"]) {
    assert.ok(html.includes(`href="https://github.com/cc1107yss/${repo}" target="_blank" rel="noopener noreferrer"`));
  }
  assert.doesNotMatch(html, /href="\/projects#/);
  assert.match(html, /Beijing Normal University/);
  assert.match(html, /Jun 2026 — Present/);
  assert.match(html, /Beijing Yongyue Intelligent Technology Co\., Ltd\. \(Loopit\)/);
  assert.match(html, /Jun 2026 — Aug 2026/);
  assert.match(html, /Sep 2024 — Jun 2028/);
  assert.match(html, /17,000\+ member Discord community/);
  assert.match(html, />clarachen07@foxmail\.com<\/a>/);
  assert.match(html, /src="\/resume\/clara-portrait\.jpg"/);
  assert.match(html, /alt="Portrait illustration of Clara Chen"/);
  assert.doesNotMatch(html, /class="academic-pdf-link"|Download (?:PDF|CV)|href="[^"]+\.pdf"/);
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

test("project terrain progressively enhances server-rendered content and leaves resume independent", async () => {
  for (const pathname of ["/", "/projects", "/zh", "/zh/projects"]) {
    const html = await (await render(pathname)).text();
    assert.match(html, /class="projects-terrain"[^>]*data-nav-theme="sand"/);
    assert.match(html, /class="terrain-poster"/);
    assert.match(html, /src="\/scenes\/terrain\/poster-desktop\.webp"/);
    assert.match(html, /srcSet="\/scenes\/terrain\/poster-mobile\.webp"/i);
    assert.match(html, /class="terrain-controls" hidden=""/);
    assert.equal((html.match(/class="reveal text-project-card"/g) ?? []).length, 6);
  }

  for (const path of ["/resume", "/zh/resume"]) {
    const resume = await (await render(path)).text();
    assert.doesNotMatch(resume, /terrain-(?:mount|poster|runtime)|\/scenes\/terrain\/|three\.module/);
  }
  for (const asset of [
    "poster-desktop.webp", "poster-mobile.webp", "ground-color-4k.webp", "ground-color-2k.webp",
    "ground-normal-4k.webp", "ground-normal-2k.webp", "ground-arm-2k.webp", "ground-arm-1k.webp",
    "ground-height.webp", "rock.glb", "pebble.glb", "rock-color.webp", "rock-normal.webp", "rock-arm.webp",
  ]) {
    await access(new URL(`../public/scenes/terrain/${asset}`, import.meta.url));
  }
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


test("both languages have one correct document, metadata, and matching language links", async () => {
  for (const path of ["", "/projects", "/resume"]) {
    for (const prefix of ["", "/zh"]) {
      const route = `${prefix}${path}` || "/";
      const html = await (await render(route)).text();
      const language = prefix ? "zh-CN" : "en";
      assert.equal((html.match(/<html\b/g) ?? []).length, 1);
      assert.ok(html.includes(`<html lang="${language}">`));
      assert.ok(html.includes(`<link rel="canonical" href="https://clarachen.dev${route}"`));
      for (const [lang, href] of [["en", path || "/"], ["zh-CN", `/zh${path}`]]) {
        assert.ok(html.includes(`hrefLang="${lang}" href="https://clarachen.dev${href}"`));
        assert.ok(html.includes(`<a href="${href}" hrefLang="${lang}" lang="${lang}"`));
      }
      assert.match(html, /property="og:image" content="https:\/\/clarachen.dev\/og.png"/);
      const switchMarkup = html.match(/<div class="language-switch"[\s\S]*?<\/div>/)?.[0];
      assert.equal((switchMarkup?.match(/aria-current="page"/g) ?? []).length, 1);
      assert.ok(switchMarkup?.includes(`lang="${language}" aria-label="${prefix ? "切换为中文" : "Switch to English"}" aria-current="page"`));
      if (prefix) {
        assert.ok(html.includes('href="/zh"'));
        if (path !== "/resume") {
          assert.ok(html.includes('href="/zh/resume"'));
          assert.match(html, /暂停地景运动/);
          assert.match(html, /重置火星视角/);
          assert.doesNotMatch(html, /aria-label="(?:Primary navigation|Zoom in|Pause landscape motion)"/);
        }
      }
    }
  }
});

test("Chinese content preserves project links, resume metrics, and PDF visibility", async () => {
  const englishProjects = await (await render("/projects")).text();
  const chineseProjects = await (await render("/zh/projects")).text();
  const englishResume = await (await render("/resume")).text();
  const chineseResume = await (await render("/zh/resume")).text();
  const repositories = html => [...html.matchAll(/href="(https:\/\/github.com\/cc1107yss\/[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(repositories(chineseProjects), repositories(englishProjects));
  assert.deepEqual(repositories(chineseResume), repositories(englishResume));
  assert.equal((chineseProjects.match(/class="reveal text-project-card"/g) ?? []).length, 6);
  assert.equal((chineseResume.match(/class="academic-project"/g) ?? []).length, 3);
  const metrics = html => [...html.matchAll(/<ul class="academic-bullets">([\s\S]*?)<\/ul>/g)].map(match => (match[1].match(/[−-]?\d+(?:[,.]\d+)*(?:%|\+)?/g) ?? []).sort());
  assert.deepEqual(metrics(chineseResume), metrics(englishResume));
  assert.match(chineseResume, /北京师范大学/);
  assert.match(chineseResume, /只读接入 Alpaca Paper/);
  assert.match(chineseResume, /置信区间/);
  assert.doesNotMatch(chineseResume, /academic-pdf-link|Download CV|Selected coursework|Internship profile/);
});
