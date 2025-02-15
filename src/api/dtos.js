import {
  camelToWord,
  deepTransformKeys,
  wordToCamel,
} from "../utils/transformations";

const isObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const getSourceValue = (source = {}) => {
  const sourceValue = Object.values(source);
  return sourceValue.length && isObject(sourceValue[0]) ? sourceValue[0] : {};
};

const getSourceVariant = (source = {}) => {
  if (!isObject(source)) {
    return "";
  }
  const sourceKeys = Object.keys(source);
  const variant = sourceKeys.length ? sourceKeys[0] : "";

  return variant;
};

export class JsonDTO {
  static convertToCamelCase(bugsJson) {
    const bugsCamel = deepTransformKeys(bugsJson, wordToCamel);
    return bugsCamel;
  }
  static convertBugs(bugsJSON) {
    const bugsCamel = this.convertToCamelCase(bugsJSON);
    return bugsCamel.map((bug) => {
      const sourceValue = getSourceValue(bug.source);
      const sourceVariant = getSourceVariant(bug.source);
      return {
        ...bug,
        source: {
          ...sourceValue,
          variant: sourceVariant,
          variantName: camelToWord(sourceVariant),
        },
      };
    });
  }

  static convertReports(reportsJSON) {
    const REPORT_BASE_URL =
      "https://github.com/zksecurity/zkbugs/blob/main/reports/";

    const reportsCamel = this.convertToCamelCase(reportsJSON, wordToCamel);
    return reportsCamel.map((report) => ({
      ...report,
      report: `${REPORT_BASE_URL}${report.file}`,
    }));
  }

  static convertTools(toolsJSON) {
    const toolsCamel = this.convertToCamelCase(toolsJSON, wordToCamel);
    return toolsCamel.map((tool, index) => ({ ...tool, id: `tool-${index}` }));
  }

  static convertDescriptions(descriptionsJSON) {
    const descriptionsCamel = this.convertToCamelCase(descriptionsJSON);
    return descriptionsCamel;
  }
}
