import { deepTransformKeys, wordToCamel } from "../utils/transformations";

export class JsonDTO {
  static convertToCamelCase(json) {
    return deepTransformKeys(json, wordToCamel);
  }
}
