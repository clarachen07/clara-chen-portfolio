export type Locale = "en" | "zh";
export type PagePath = "/" | "/projects" | "/resume";

export function localizedPath(locale: Locale, path: string = "/") {
  return locale === "zh" ? `/zh${path === "/" ? "" : path}` : path;
}

const english = {
  navigation: { projects: "Projects", resume: "Resume", home: "Home", menu: "Menu", close: "Close", primary: "Primary navigation", mobile: "Mobile navigation", homeLabel: "Clara Chen — home", language: "Language" },
  home: { tagline: "A lifelong learner and explorer.", title: "Clara Chen — Mathematics, AI & Product", description: "Clara Chen is a mathematics undergraduate researching LLM reasoning, mathematical modeling, and useful AI products." },
  projects: { title: "Projects", description: "Selected research, mathematical modeling, and product work by Clara Chen.", heading: "I turn questions into models, tools, and experiences.", archive: "Project archive · 2025—2026", selected: "Selected work", repository: "Repository" },
  footer: { understand: "To understand", more: "a little more.", build: "To build something", matters: "that matters." },
  resume: { title: "Résumé", sections: "Résumé sections", profile: "Profile", education: "Education", experience: "Experience", research: "Research", skills: "Skills", researchHeading: "Research & modeling", profileKicker: "Internship profile · Class of 2028", educationKicker: "Mathematical foundations", experienceKicker: "Data & systems", skillsKicker: "Technical toolkit", role: "Mathematics Undergraduate", school: "Beijing Normal University", location: "Beijing, China", city: "Beijing", locationLabel: "LOC", emailLabel: "EMA", email: "Email", contacts: "Contact and profile links", portrait: "Portrait illustration of Clara Chen", coursework: "Selected coursework", download: "Download CV" },
  scenes: { landscapePause: "Pause landscape", landscapeResume: "Resume landscape", landscapePauseLabel: "Pause landscape motion", landscapeResumeLabel: "Resume landscape motion", landscapeFallback: "Static landscape shown. The interactive landscape is unavailable.", marsInstructions: "Mars in deep space. Drag to turn it. Use arrow keys to rotate, plus and minus to zoom, and Home to reset.", marsPlay: "Play Mars animation", marsPause: "Pause Mars animation", zoomIn: "Zoom in", zoomOut: "Zoom out", marsReset: "Reset Mars view", marsFallback: "Static Mars view shown. Interactive view is unavailable." },
};

export const messages: Record<Locale, typeof english> = {
  en: english,
  zh: {
    navigation: { projects: "项目", resume: "简历", home: "首页", menu: "菜单", close: "关闭", primary: "主导航", mobile: "移动端导航", homeLabel: "Clara Chen — 首页", language: "语言" },
    home: { tagline: "终身学习，不断探索。", title: "Clara Chen — 数学、人工智能与产品", description: "陈晨，北京师范大学数学本科生，探索大模型推理、数学建模与人工智能应用。" },
    projects: { title: "项目", description: "陈晨的研究、数学建模与产品项目精选。", heading: "将问题转化为模型、工具与体验。", archive: "项目档案 · 2025—2026", selected: "精选项目", repository: "代码仓库" },
    footer: { understand: "多理解", more: "一点世界。", build: "多创造", matters: "一些价值。" },
    resume: { title: "简历", sections: "简历导航", profile: "个人简介", education: "教育背景", experience: "实践经历", research: "研究项目", skills: "技能", researchHeading: "研究与建模", profileKicker: "实习简历 · 2028 届", educationKicker: "数学基础", experienceKicker: "数据与系统", skillsKicker: "技术能力", role: "数学与应用数学本科生", school: "北京师范大学", location: "中国，北京", city: "北京", locationLabel: "地点", emailLabel: "邮箱", email: "邮箱", contacts: "联系方式与个人主页", portrait: "陈晨的肖像插画", coursework: "核心课程", download: "下载简历" },
    scenes: { landscapePause: "暂停地景动画", landscapeResume: "继续地景动画", landscapePauseLabel: "暂停地景运动", landscapeResumeLabel: "恢复地景运动", landscapeFallback: "交互地景暂不可用，已显示静态地景。", marsInstructions: "深空中的火星。拖动以转动，使用方向键旋转，加减号缩放，Home 键重置视角。", marsPlay: "播放火星动画", marsPause: "暂停火星动画", zoomIn: "放大", zoomOut: "缩小", marsReset: "重置火星视角", marsFallback: "交互视图暂不可用，已显示静态火星图像。" },
  },
};
