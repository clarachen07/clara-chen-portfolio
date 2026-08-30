export const homeContent = {
  nav: [
    { label: "About", href: "#about", internal: false },
    { label: "Work", href: "/projects", internal: true },
    { label: "Resume", href: "/resume", internal: true },
    { label: "Contact", href: "mailto:clarachen07@foxmail.com", internal: false },
  ],
  name: { first: "Clara", last: "Chen" },
  statement: [
    "I explore the space",
    "where mathematics,",
    "art, and design",
    "intersect.",
  ],
  roles: ["Researcher. Designer.", "Builder. Dreamer."],
  traits: ["Systems Thinker", "Visual Storyteller", "Problem Solver"],
  cta: "Explore My Work",
} as const;
