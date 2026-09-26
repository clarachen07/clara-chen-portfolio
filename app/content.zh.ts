import { resumeData, type ResumeData } from "./content";

export type ProjectTranslation = {
  title: string;
  discipline: string;
  summary: string;
  status: string;
  stack: readonly string[];
};

export const projectTranslations: Record<string, ProjectTranslation> = {
  "llm-post-training-mechanism": {
    title: "大语言模型后训练机制研究",
    discipline: "大模型对齐与机制可解释性",
    summary: "通过可复现的先导实验，追踪 Tülu-3-8B 系列从 Base、SFT、DPO 到 RLVR 的数学推理行为变化。",
    status: "研究进行中",
    stack: ["PyTorch", "Transformers", "vLLM", "pandas", "MATH-500"],
  },
  "typhoon-rainfall": {
    title: "台风极端降雨建模",
    discipline: "数学建模与地理空间机器学习",
    summary: "在台风相对坐标系下建立建模流程，解释降雨结构、生成未观测台风的降雨场，并模拟虚拟风险情景。",
    status: "竞赛研究",
    stack: ["Python", "GPM IMERG", "随机森林", "EOF/PCA", "rasterio"],
  },
  "memory-album-diy": {
    title: "Memory Album DIY · 回忆相册生成器",
    discipline: "注重隐私的产品设计",
    summary: "完全在浏览器中运行的个人回忆网站生成器，支持上传、写作、主题设置、预览与导出，无需账号或后端。",
    status: "原型已发布",
    stack: ["TypeScript", "Next.js", "IndexedDB", "localStorage", "JSZip"],
  },
  "sic-infrared-thickness": {
    title: "SiC 红外光谱厚度反演",
    discipline: "光学建模 · MATLAB",
    summary: "结合复介电函数、斜入射菲涅耳公式、Fabry–Pérot 干涉与光谱拟合，从红外反射光谱中估计 SiC 和 Si 外延层厚度。",
    status: "竞赛归档",
    stack: ["MATLAB", "光学建模", "Fabry–Pérot", "光谱拟合"],
  },
  "limit-of-rlvr-reproduction": {
    title: "Limit of RLVR 复现研究",
    discipline: "可审计的 MATH-500 复现 · Python",
    summary: "复现 Limit of RLVR 中 Qwen2.5-7B 的 MATH500 对比，固定提示词、模型版本、采样设置和八组实验执行顺序，区分低采样预算下的性能增益与高预算下的覆盖能力。",
    status: "复现研究",
    stack: ["Qwen2.5-7B", "MATH500", "vLLM", "Python"],
  },
  "docs-as-code": {
    title: "Docs as Code · 文档即代码",
    discipline: "可复用的文档工作流",
    summary: "通过 Markdown、分支、Pull Request、Issue 和 RFD 决策记录管理研究与产品知识，让证据、讨论和当前结论保持关联。",
    status: "开放工具集",
    stack: ["Markdown", "Git", "Pull Request", "RFD"],
  },
};

const researchTranslations: Record<string, Pick<ResumeData["selectedProjects"][number], "title" | "discipline" | "bullets">> = {
  "llm-evaluation": {
    title: "大模型后训练与统计评测",
    discipline: "实验设计 · 统计推断 · 可复现性",
    bullets: [
      "固定实验设置，结合配对 Bootstrap 分析搭建可复现的后训练评测流程，审计 128,000 条 Qwen 生成结果。",
      "SimpleRL 的 pass@1 为 77.93%，高于 Base 的 61.39%；但 pass@128 低 3.20 个百分点（95% 置信区间：−5.00 至 −1.40），揭示性能与覆盖能力之间的权衡。",
    ],
  },
  "typhoon-modeling": {
    title: "台风极端降雨建模",
    discipline: "时空数据 · 机器学习 · 情景分析",
    bullets: [
      "融合台风路径、降雨栅格与地形数据，使用随机森林分析降雨结构，并通过相似样本检索、PCA 与分位数校准生成降雨场。",
      "雨带质心偏移的测试集 R² 达 0.684；伪缺失验证中，P95 误差较原始模板下降 39.7%。",
    ],
  },
  "spectral-inversion": {
    title: "半导体外延层厚度估计",
    discipline: "CUMCM 2025 · 参数估计 · 信号处理",
    bullets: [
      "基于复介电函数和 Fabry–Pérot 干涉建立 SiC、Si 红外反射模型，估计外延层厚度。",
      "通过条纹间距分析交叉核验非线性最小二乘估计，交付可独立运行的 MATLAB 脚本与完整竞赛论文。",
    ],
  },
};

const researchLinkLabels: Record<string, string> = {
  "Post-training research": "后训练研究",
  "RLVR replication": "RLVR 复现",
  Repository: "代码仓库",
};

export const resumeDataZh: ResumeData = {
  ...resumeData,
  headline: "大模型推理与后训练 | AI4Finance | 量化 | Agent",
  summary: "数学与应用数学本科生，关注量化研究与机器学习。学术与项目经历涵盖大语言模型研究、量化金融和数据分析，致力于运用数学与计算方法解决现实问题。",
  contactLabel: "欢迎联系实习机会",
  experience: [
    {
      ...resumeData.experience[0],
      role: "产品经理 · AI 平台方向",
      type: "金融数据管道 · 风险审计 · 研究自动化",
      dates: "2026.06 — 至今",
      bullets: [
        "审计最大回撤计算，只读接入 Alpaca Paper 账户数据，修复成本数据不一致问题并补充回归测试。",
        "开发 Zen Content Hub，自动化研究与发布流程，支持持久化队列、去重和失败恢复。",
        "内容生产耗时降低 70%+，支撑 200+ 篇内容发布与 50+ 天稳定运行。",
      ],
    },
    {
      ...resumeData.experience[1],
      role: "创作者运营实习生",
      organization: "北京涌跃智能有限公司（Loopit）",
      type: "数据采集 · 用户归因 · 运营工程",
      dates: "2026.06 — 2026.08",
      bullets: [
        "为 17,000+ 人的 Discord 社群开发只读数据采集服务，覆盖历史回溯与实时监听。",
        "实现幂等存储与来源追踪，关联社群作者和端内创作者，交付看板、JSON API 与去重 CSV 导出。",
      ],
    },
  ],
  education: [
    {
      institution: "北京师范大学",
      degree: "数学与应用数学 · 本科在读",
      dates: "2024.09 — 2028.06（预计）",
      coursework: ["概率论", "数理统计", "数学建模", "数学分析", "高等代数", "实变函数", "泛函分析"],
      honors: ["美国大学生数学建模竞赛（MCM/ICM）二等奖", "北京师范大学数学建模竞赛二等奖", "清华大学农研院 2024 年暑期调研二等奖"],
    },
  ],
  selectedProjects: resumeData.selectedProjects.map(project => ({
    ...project,
    ...researchTranslations[project.slug],
    links: project.links?.map(link => ({ ...link, label: researchLinkLabels[link.label] })),
  })),
  skills: resumeData.skills.map((group, index) => ({
    ...group,
    category: ["编程与数据", "统计与建模", "研究与工程工具"][index],
  })),
  links: resumeData.links.map(link => ({ ...link, label: link.label === "Email" ? "邮箱" : link.label })),
};
