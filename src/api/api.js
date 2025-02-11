import { JsonDTO } from "./dtos";

const fetchBugs = async () => {
  const response = await fetch("/dataset/bugs.json");
  const rawData = await response.json();
  const bugs = JsonDTO.convertBugs(rawData);
  return bugs;
};

const fetchReports = async () => {
  const response = await fetch("/dataset/reports.json");
  const rawData = await response.json();
  const reports = JsonDTO.convertReports(rawData);
  return reports;
};

const fetchDescriptions = async () => {
  const response = await fetch("/dataset/descriptions.json");
  const rawData = await response.json();
  const descriptions = JsonDTO.convertDescriptions(rawData);
  return descriptions;
};

const fetchSecurityTools = async () => {
  const response = await fetch("/dataset/tools.json");
  const rawData = await response.json();
  const tools = JsonDTO.convertTools(rawData);
  return tools;
};

export const api = {
  fetchBugs,
  fetchReports,
  fetchDescriptions,
  fetchSecurityTools,
};
