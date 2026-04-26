export const paths = {
  descriptions: "/descriptions",
  home: "/",
  paper: "/paper",
  tools: "/tools",
  toolsEvaluation: "/tools-evaluation",
  reports: "/reports",
  bugDetail: "/bugs/:bugId",
  reportDetail: "/reports/:reportId",
};

export const bugPath = (id) => `/bugs/${encodeURIComponent(id)}`;
export const reportPath = (id) => `/reports/${encodeURIComponent(id)}`;

export const pathsLabeled = [
  { to: paths.home, label: "Bugs" },
  { to: paths.reports, label: "Reports" },
  { to: paths.descriptions, label: "Descriptions" },
  { to: paths.tools, label: "Security Tools" },
  { to: paths.toolsEvaluation, label: "Tools Evaluation" },
  { to: paths.paper, label: "Paper" },
];
