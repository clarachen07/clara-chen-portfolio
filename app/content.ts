export type ProjectMetric = {
  value: string;
  label: string;
};

export type ProjectSection = {
  label: "Question" | "Approach" | "Evidence" | "Outcome";
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  discipline: string;
  summary: string;
  status: string;
  year: string;
  stack: readonly string[];
  metrics: readonly ProjectMetric[];
  sections: readonly ProjectSection[];
  assets: readonly { src: string; alt: string }[];
  repoUrl: string;
  featured: boolean;
};

export type ResumeData = {
  headline: string;
  summary: string;
  experience: readonly {
    role: string;
    organization: string;
    type: string;
    dates: string;
    summary: string;
    impact: string;
    stack: readonly string[];
  }[];
  education: readonly {
    institution: string;
    degree: string;
    dates: string;
    honors: readonly string[];
  }[];
  selectedProjects: readonly string[];
  skills: readonly { category: string; items: readonly string[] }[];
  links: readonly { label: string; href: string }[];
  pdfUrl: string | null;
};

export const projects: readonly Project[] = [
  {
    slug: "llm-post-training-mechanism",
    title: "LLM Post-Training Mechanism Research",
    shortTitle: "Post-Training Reasoning",
    discipline: "LLM alignment & mechanistic interpretability",
    summary:
      "A reproducible pilot tracing how Base, SFT, DPO, and RLVR stages reshape mathematical reasoning behavior in the Tülu-3-8B series.",
    status: "Active research",
    year: "2026",
    stack: ["PyTorch", "Transformers", "vLLM", "pandas", "MATH-500"],
    metrics: [
      { value: "4", label: "post-training stages" },
      { value: "35%", label: "final pilot accuracy" },
      { value: "20", label: "audited MATH-500 problems" },
    ],
    sections: [
      {
        label: "Question",
        title: "Does post-training create new reasoning—or stabilize what already exists?",
        body: "The study asks whether correct trajectories emerge during post-training or whether training makes latent trajectories in the base model earlier, more stable, and more likely on verifiable tasks.",
      },
      {
        label: "Approach",
        title: "Hold the evaluation constant and change only the training stage.",
        body: "The pilot runs stage-aligned generation across Base, SFT, DPO, and Final/RLVR models, then applies automatic answer extraction, manual review of uncertain cases, and a shared behavior summary pipeline.",
      },
      {
        label: "Evidence",
        title: "A small, audited pilot proves the pipeline before scaling it.",
        body: "On a 20-problem MATH-500 subset, manually reviewed accuracy was 25% for Base, 20% for SFT, 20% for DPO, and 35% for Final/RLVR. These are feasibility results, not benchmark claims.",
      },
      {
        label: "Outcome",
        title: "The behavioral layer is complete; representation-level analysis is next.",
        body: "The repository now contains a reproducible end-to-end evaluation system. Planned work includes hidden-state extraction, linear probes, ΔlogP analysis, and causal tests of reasoning trajectories.",
      },
    ],
    assets: [
      {
        src: "/projects/llm-post-training-results.svg",
        alt: "Table comparing manually reviewed MATH-500 pilot accuracy across Base, SFT, DPO, and Final RLVR stages",
      },
    ],
    repoUrl: "https://github.com/cc1107yss/llm-post-training-mechanism",
    featured: true,
  },
  {
    slug: "typhoon-rainfall",
    title: "Typhoon Extreme-Rainfall Modeling",
    shortTitle: "Typhoon Rainfall",
    discipline: "Mathematical modeling & geospatial ML",
    summary:
      "A storm-relative modeling pipeline that explains rainfall structure, generates fields for unobserved typhoons, and simulates virtual risk scenarios.",
    status: "Competition research",
    year: "2026",
    stack: ["Python", "GPM IMERG", "Random Forest", "EOF/PCA", "rasterio"],
    metrics: [
      { value: "0.684", label: "test R², centroid offset" },
      { value: "39.7%", label: "P95 error reduction" },
      { value: "1,208 mm", label: "slow-scenario peak accumulation" },
    ],
    sections: [
      {
        label: "Question",
        title: "How do track, intensity, and environment shape extreme rainfall?",
        body: "The project connects typhoon motion and intensity with interpretable rainfall structure, then asks whether historical patterns can generate plausible fields for storms without matching satellite observations.",
      },
      {
        label: "Approach",
        title: "Rotate every storm into one shared frame of reference.",
        body: "A storm-relative coordinate system supports structural metrics, Spearman analysis, Random Forest models, analog-template retrieval, EOF/PCA correction, and extreme-quantile calibration.",
      },
      {
        label: "Evidence",
        title: "Pseudo-missing experiments test the generator against known storms.",
        body: "After extreme-quantile calibration, P95, P99, and heavy-rain-area errors fall by 39.7%, 39.4%, and 37.1% versus the raw template field. Generated sequences cover 421 and 553 half-hourly steps for KONG-REY and MAN-YI.",
      },
      {
        label: "Outcome",
        title: "Slow-moving storms emerge as the highest-impact scenario.",
        body: "In the virtual KONG-REY scenario, slower translation raises peak accumulated rainfall from 723.5 mm to 1,208.1 mm and maximum heavy-rain duration from 24.5 to 39.0 hours.",
      },
    ],
    assets: [
      {
        src: "/projects/typhoon-representative-fields.png",
        alt: "Representative generated half-hourly rainfall fields for Typhoon KONG-REY",
      },
      {
        src: "/projects/typhoon-slow-scenario.png",
        alt: "Accumulated rainfall map for the slowed-translation virtual typhoon scenario",
      },
    ],
    repoUrl: "https://github.com/cc1107yss/typhoon_rainfall_project",
    featured: true,
  },
  {
    slug: "memory-album-diy",
    title: "Memory Album DIY",
    shortTitle: "Memory Album DIY",
    discipline: "Privacy-first product design",
    summary:
      "A browser-only builder for personal memory-album websites: upload, write, theme, preview, and export without accounts or a backend.",
    status: "Shipped prototype",
    year: "2026",
    stack: ["TypeScript", "Next.js", "IndexedDB", "localStorage", "JSZip"],
    metrics: [
      { value: "0", label: "server uploads" },
      { value: "3", label: "visual themes" },
      { value: "4", label: "memoir sections" },
    ],
    sections: [
      {
        label: "Question",
        title: "Can a personal publishing tool feel intimate without collecting personal data?",
        body: "The product helps friends create memory websites while keeping private photos and writing on the user's own device throughout the editing flow.",
      },
      {
        label: "Approach",
        title: "Make the browser the entire application boundary.",
        body: "Text drafts live in localStorage, photos live in IndexedDB, and JSZip packages the finished static site. Users can later re-import an exported ZIP or content file to continue editing.",
      },
      {
        label: "Evidence",
        title: "One content model supports three distinct visual expressions.",
        body: "Rose Orbit, Paper Scrapbook, and Midnight Gallery all render the same Timeline, Archive, Our Story, and Letter structure. The builder and documentation are bilingual.",
      },
      {
        label: "Outcome",
        title: "The output is portable, inspectable, and ready to host anywhere.",
        body: "Every export is a standalone HTML package with its content and image assets. There is no build command, no account, no analytics, and no hidden server dependency.",
      },
    ],
    assets: [],
    repoUrl: "https://github.com/cc1107yss/memory-album-diy",
    featured: true,
  },
] as const;

export const otherProjects = [
  {
    slug: "sic-infrared-thickness",
    title: "SiC Infrared Thickness Inversion",
    discipline: "Optical modeling · MATLAB",
    summary:
      "An inverse-modeling project combining complex dielectric functions, oblique-incidence Fresnel and Fabry–Pérot interference, and spectral fitting to estimate SiC and Si epitaxial-layer thickness from infrared reflection spectra.",
    status: "Competition archive",
    year: "2025",
    stack: ["MATLAB", "Optical modeling", "Fabry–Pérot", "Spectral fitting"],
    href: "https://github.com/cc1107yss/cumcm-2025-sic-infrared-thickness",
  },
  {
    slug: "limit-of-rlvr-reproduction",
    title: "Limit of RLVR Reproduction",
    discipline: "Auditable MATH-500 reproduction · Python",
    summary:
      "An auditable reproduction of the Qwen2.5-7B MATH500 comparison from Limit of RLVR, fixing prompts, model revisions, sampling, and an eight-run execution order to separate low-budget gains from high-budget coverage.",
    status: "Reproduction study",
    year: "2026",
    stack: ["Qwen2.5-7B", "MATH500", "vLLM", "Python"],
    href: "https://github.com/cc1107yss/limit-of-rlvr-qwen7b-math500-reproduction",
  },
  {
    slug: "docs-as-code",
    title: "Docs as Code",
    discipline: "Reusable documentation workflow",
    summary:
      "A reusable workflow for managing research and product knowledge with Markdown, branches, pull requests, Issues, and durable RFD-style decisions—so evidence, discussion, and current answers stay connected.",
    status: "Open toolkit",
    year: "2026",
    stack: ["Markdown", "Git", "Pull requests", "RFDs"],
    href: "https://github.com/cc1107yss/docs-as-code",
  },
] as const;

export const resumeData: ResumeData = {
  headline:
    "Mathematics Undergraduate · Large Language Models · AI Applications · Post-Training · AI Agents · Engineering",
  summary:
    "I am a mathematics undergraduate who is interested in LLM alignment, reasoning, mathematical modeling, and AI applications.",
  experience: [
    {
      role: "Product Manager, AI Platform",
      organization: "Zen Trading",
      type: "AI application engineering · Cost operations",
      dates: "Jun 2026 — Present",
      summary:
        "Led the Zen Content Hub from requirements through deployment, connecting Slack commands, LLM-assisted research and writing, and downstream publishing drafts. Audited cost-data and portfolio-risk pipelines, then added persistence, recovery, and regression coverage.",
      impact:
        "Published 100+ pieces, added 200+ followers, reduced production time by 60%+, and kept the system stable for 40+ days.",
      stack: ["Node.js", "Python", "FastAPI", "SQLite", "Slack Bolt", "OpenRouter", "GitHub Actions", "Linux"],
    },
    {
      role: "Creator Operations Intern",
      organization: "Beijing Yongyue Intelligent Technology Co., Ltd. (Loopit)",
      type: "Creator growth · Operations engineering",
      dates: "Jun 2026 — Aug 2026",
      summary:
        "Built a read-only Discord-to-Loopit collection service covering historical backfills and live monitoring. The system extracts work links from messages, embeds, and attachments, records traceable creator metadata in SQLite, and exports deduplicated JSON and CSV for creator operations.",
      impact:
        "Supported a 17,000+ member community, maintained relationships with 500+ creators, and contributed to 25%+ community activity and 90%+ creator retention.",
      stack: ["TypeScript", "Node.js", "Express", "Discord.js", "SQLite", "Vitest", "JSON API", "CSV"],
    },
  ],
  education: [
    {
      institution: "Beijing Normal University",
      degree: "B.S. candidate, Mathematics and Applied Mathematics",
      dates: "Sep 2024 — Jun 2028",
      honors: [
        "MCM/ICM Meritorious Winner (Second Prize)",
        "Second Prize, 2024 Summer Field Research, Tsinghua University Institute for Agriculture and Rural Development",
      ],
    },
  ],
  selectedProjects: projects.map((project) => project.slug),
  skills: [
    {
      category: "Research",
      items: ["LLM post-training", "Model evaluation", "Mathematical modeling", "Statistical analysis"],
    },
    {
      category: "Technical",
      items: ["Python", "C++", "Node.js", "FastAPI", "SQLite", "Git / GitHub Actions", "Linux / systemd"],
    },
    {
      category: "Systems & Operations",
      items: ["API integration", "Data pipelines", "Testing and code audit", "Failure recovery", "Creator and community operations"],
    },
  ],
  links: [
    { label: "Email", href: "mailto:clarachen07@foxmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/clara-chen-1b11a2419/" },
    { label: "GitHub", href: "https://github.com/cc1107yss" },
  ],
  pdfUrl: null,
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
