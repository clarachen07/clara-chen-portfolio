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
  contactLabel: string;
  experience: readonly {
    role: string;
    organization: string;
    type: string;
    dates: string;
    bullets: readonly string[];
    stack: readonly string[];
  }[];
  education: readonly {
    institution: string;
    degree: string;
    dates: string;
    coursework: readonly string[];
    honors: readonly string[];
  }[];
  selectedProjects: readonly {
    slug: string;
    title: string;
    discipline: string;
    year: string;
    bullets: readonly string[];
    stack: readonly string[];
    links?: readonly { label: string; href: string }[];
  }[];
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
  headline: "LLM Reasoning & Post-Training | AI4Finance | Quant | Agent",
  summary:
    "Mathematics and Applied Mathematics undergraduate with interests in quantitative research and machine learning. My academic and project experience includes LLM research, quantitative finance, and data analysis, with a focus on applying mathematical and computational methods to real-world problems.",
  contactLabel: "Get in touch about internships",
  experience: [
    {
      role: "Product Manager · Quantitative Developer",
      organization: "Zen Trading",
      type: "Financial research automation · Data engineering · Risk auditing",
      dates: "Jun 2026 — Present",
      bullets: [
        "Led product design, development, and launch of Slack-driven AI agent workflows for QDII holdings queries, company and macro research, report translation, and U.S. market opening briefs. Built multi-source retrieval, evidence organization, and sentence-level fact-checking with source and citation trails.",
        "Connected WeChat Official Accounts, Customer.io email, and Discord distribution; implemented SQLite-backed queues, concurrency control, idempotent deduplication, and checkpoint recovery, with offline evaluation, regression testing, and Linux deployment and monitoring.",
        "Produced 200+ content pieces and gained 300+ followers; reduced production time by 70%+ and maintained stable operation for 50+ days, while improving cost and risk data consistency, traceability, and regression coverage.",
      ],
      stack: ["Node.js / Python", "SQLite", "Slack Bolt", "Linux / systemd"],
    },
    {
      role: "Operations Intern",
      organization: "Beijing Yongyue Intelligence Co., Ltd. (Loopit)",
      type: "Data operations · User attribution · Growth analysis",
      dates: "Jun 2026 — Aug 2026",
      bullets: [
        "Supported creator operations for a 17,000+ member Discord community; identified and maintained relationships with 500+ creators through targeted outreach, push notifications, and in-app interactions, and established content standards.",
        "Independently built a creation-link collector for historical backfills and real-time monitoring across accessible channels, with link extraction, idempotent SQLite storage, a dashboard, and deduplicated CSV exports. Linked community authors, creations, and in-app creators for attribution and segmented outreach.",
        "Community activity reached 25%+ and creator retention reached 90%+ during the operational period; the data pipeline supported user attribution, creation statistics, and daily operations.",
      ],
      stack: ["TypeScript", "Discord.js", "SQLite", "Vitest"],
    },
  ],
  education: [
    {
      institution: "Beijing Normal University",
      degree: "B.S. candidate, Mathematics and Applied Mathematics",
      dates: "Sep 2024 — Jun 2028 (Expected)",
      coursework: ["Probability", "Mathematical Statistics", "Mathematical Modeling", "Mathematical Analysis", "Advanced Algebra", "Real Analysis", "Functional Analysis"],
      honors: [
        "MCM/ICM Meritorious Winner",
        "Second Prize, Beijing Normal University Mathematical Modeling Competition",
        "Second Prize, 2024 Summer Field Research, Tsinghua University Institute for Agriculture and Rural Development",
      ],
    },
  ],
  selectedProjects: [
    {
      slug: "llm-evaluation",
      title: "LLM Post-Training, Reasoning & Interpretability Research",
      discipline: "Ongoing · Post-training · Reasoning · Interpretability",
      year: "2026",
      bullets: [
        "Study how SFT, DPO, and RLVR affect reasoning and internal representations, focusing on symbolic grounding, representation manifolds, and reasoning trajectory geometry. Built inference, automated scoring, and statistical pipelines for MATH-500 and GSM8K stage comparisons, multi-seed sampling, and prompt-protocol experiments.",
        "Reproduced ProofWriter attention probes with grouped cross-validation and random-weight controls; conducted multi-condition SSP QLoRA ablations, layerwise activation extraction, and trajectory analysis to examine step-boundary sensitivity.",
        "Established a reproducible workflow spanning behavioral evaluation, internal representation analysis, and statistical validation, with documented protocols, code, and audit records to support further grounding and manifold research.",
      ],
      stack: ["Python", "PyTorch", "Transformers / PEFT", "vLLM"],
      links: [
        { label: "Post-training research", href: "https://github.com/cc1107yss/llm-post-training-mechanism" },
        { label: "RLVR replication", href: "https://github.com/cc1107yss/limit-of-rlvr-qwen7b-math500-reproduction" },
      ],
    },
    {
      slug: "typhoon-modeling",
      title: "Typhoon Extreme-Rainfall Structure & Field Generation",
      discipline: "Machine learning · Spatiotemporal data · Scenario simulation",
      year: "2026",
      bullets: [
        "Combined CMA storm tracks, GPM half-hourly precipitation, and terrain data in a storm-relative coordinate frame; extracted intensity quantiles, rainband anisotropy, and centroid offsets to model unobserved typhoons.",
        "Identified drivers with Spearman correlation and random forests; generated rainfall fields through analog retrieval, template fusion, PCA correction, and extreme-quantile mapping for scenario analysis.",
        "Achieved test-set R² of 0.684 / 0.640 for centroid offset / rainband anisotropy. Historical pseudo-missing validation reduced P95, P99, and heavy-rainfall area errors by 39.7% / 39.4% / 37.1% versus raw templates; won Second Prize in the Beijing Normal University Mathematical Modeling Competition.",
      ],
      stack: ["Python", "NumPy / pandas", "scikit-learn", "Rasterio"],
      links: [{ label: "Repository", href: "https://github.com/cc1107yss/typhoon_rainfall_project" }],
    },
    {
      slug: "spectral-inversion",
      title: "Semiconductor Thickness Estimation",
      discipline: "CUMCM 2025 · Parameter estimation · Signal processing",
      year: "2025",
      bullets: [
        "Modeled SiC and Si infrared reflectance using complex dielectric functions and Fabry–Pérot interference to estimate epitaxial-layer thickness.",
        "Cross-checked nonlinear least-squares estimates against fringe-spacing analysis; delivered runnable MATLAB scripts and a complete competition paper.",
      ],
      stack: ["MATLAB"],
      links: [{ label: "Repository", href: "https://github.com/cc1107yss/cumcm-2025-sic-infrared-thickness" }],
    },
  ],
  skills: [
    {
      category: "Programming & Data",
      items: ["Python", "C++", "MATLAB", "SQL"],
    },
    {
      category: "Statistics & Modeling",
      items: ["NumPy / pandas", "scikit-learn", "Bootstrap", "PCA"],
    },
    {
      category: "Research & Engineering Tools",
      items: ["PyTorch / Transformers", "PEFT / vLLM", "Git / GitHub Actions", "Linux / systemd"],
    },
  ],
  links: [
    { label: "Email", href: "mailto:clarachen07@foxmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/clara-chen-1b11a2419/" },
    { label: "GitHub", href: "https://github.com/clarachen07" },
  ],
  pdfUrl: null,
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
