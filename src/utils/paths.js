export const paths = {
  descriptions: "/descriptions",
  home: "/",
  paper: "/paper",
  tools: "/tools",
  reports: "/reports",
  reportDetail: "/reports/:reportId",
};

export const reportPath = (id) => `/reports/${encodeURIComponent(id)}`;

export const pathsLabeled = [
  { to: paths.home, label: "Bugs" },
  { to: paths.reports, label: "Reports" },
  { to: paths.descriptions, label: "Descriptions" },
  { to: paths.tools, label: "Security Tools" },
  { to: paths.paper, label: "Paper" },
];
