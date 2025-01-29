import { JsonDTO } from "./dtos";

const fetchBugs = async () => {
  const response = await fetch("/dataset/bugs.json");
  const rawData = await response.json();
  const bugs = JsonDTO.convertToCamelCase(rawData);
  return bugs;
};

export const api = {
  fetchBugs,
};
