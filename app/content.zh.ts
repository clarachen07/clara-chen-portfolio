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
    title: "大语言模型后训练、推理与可解释性研究",
    discipline: "进行中 · 后训练 · 推理 · 可解释性",
    bullets: [
      "研究 SFT、DPO、RLVR 对推理表现与内部表征的影响，关注符号接地、表征流形及推理轨迹几何；搭建推理、自动评分与统计分析流水线，在 MATH-500、GSM8K 上开展阶段对照、多种子采样及提示协议实验。",
      "基于 ProofWriter 复现注意力探针，以分组交叉验证和随机权重对照分析内部推理信息；开展 SSP 多条件 QLoRA 消融、层级激活提取与轨迹分析，检查步骤边界对评测结果的影响。",
      "形成行为评测、内部表征分析与统计验证的可复现研究流程，沉淀实验协议、代码与审计记录，为符号接地机制和推理表征流形的进一步研究建立实验基础。",
    ],
  },
  "typhoon-modeling": {
    title: "台风极端降雨结构分析与降雨场生成",
    discipline: "机器学习 · 时空数据 · 场景模拟",
    bullets: [
      "融合 CMA 台风路径、GPM 半小时降水与地形数据，构建随台风中心及移动方向旋转的坐标系，提取强度分位数、雨带各向异性与质心偏移，为未观测台风建模。",
      "通过 Spearman 相关和随机森林识别驱动因素，以相似样本检索、模板融合、PCA 校正及极端分位数映射生成降雨场，支持场景分析。",
      "雨带质心偏移 / 各向异性的测试集 R² 达 0.684 / 0.640；历史伪缺失验证中，P95、P99 与强降雨面积误差较原始模板分别下降 39.7% / 39.4% / 37.1%；获北京师范大学数学建模竞赛二等奖。",
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
      role: "产品经理 · 量化开发",
      type: "金融研究自动化 · 数据工程 · 风险审计",
      dates: "2026.06 — 至今",
      bullets: [
        "主导金融研究与内容平台的产品设计、开发及上线，将 QDII 持仓查询、公司与宏观分析、研报翻译及美股开盘简报整合为 Slack 驱动的 AI Agent 工作流；搭建多源检索、证据整理与逐句事实核验流水线，保留来源与引用链路。",
        "打通微信公众号、Customer.io 邮件及 Discord 分发；实现 SQLite 持久化队列、并发控制、幂等去重与断点恢复，建立离线评测、回归测试及 Linux 部署与监控流程。",
        "累计产出 200+ 篇内容、新增关注 300+ 人，生产耗时降低 70%+，稳定运行 50+ 天；提升成本与风险数据的一致性、可追溯性及核心逻辑回归覆盖。",
      ],
    },
    {
      ...resumeData.experience[1],
      role: "运营实习生",
      organization: "北京涌跃智能有限公司（Loopit）",
      type: "数据运营 · 用户归因 · 增长分析",
      dates: "2026.06 — 2026.08",
      bullets: [
        "面向 17,000+ 人的 Discord 社群开展创作者运营，通过定向触达、Push 推送及端内互动发掘并维护 500+ 位创作者，沉淀内容标准。",
        "独立开发作品链接采集工具，覆盖可访问频道的历史回溯与实时监听，实现链接抽取、SQLite 幂等存储、看板与 CSV 去重导出；建立社群作者、作品与端内创作者的可追踪关联，支持用户归因及分层触达。",
        "运营期间社群活跃度达 25%+、创作者留存率达 90%+；通过数据链路支持用户归因、作品统计及日常运营。",
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
