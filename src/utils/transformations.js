export const deepTransformKeys = (obj, transform, exclude = []) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepTransformKeys(item, transform));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const finalKey = exclude.includes(key) ? key : transform(key);
      return [finalKey, deepTransformKeys(value, transform)];
    })
  );
};

export const wordToCamel = (word) => {
  const [first, ...rest] = word.split(" ");

  return (
    first.toLowerCase() +
    rest.map((str) => str[0].toUpperCase() + str.slice(1)).join("")
  );
};

export const camelToWord = (camel) => {
  return camel
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
