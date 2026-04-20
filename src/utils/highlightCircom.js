const KEYWORDS = new Set([
  "pragma",
  "circom",
  "include",
  "template",
  "function",
  "component",
  "signal",
  "input",
  "output",
  "public",
  "private",
  "main",
  "var",
  "return",
  "for",
  "while",
  "if",
  "else",
  "log",
  "assert",
  "parallel",
  "custom_templates",
  "custom",
  "bus",
]);

const BUILTINS = new Set(["Num2Bits", "Bits2Num", "IsZero", "IsEqual"]);

const PATTERNS = [
  { type: "comment", regex: /^\/\/[^\n]*/ },
  { type: "comment", regex: /^\/\*[\s\S]*?\*\// },
  { type: "string", regex: /^"(?:\\.|[^"\\])*"/ },
  { type: "number", regex: /^0x[0-9a-fA-F]+|^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/ },
  // Circom-specific constraint/assignment operators (must come before generic ops)
  { type: "constraint", regex: /^(?:<==|==>|<--|-->|===|!==)/ },
  { type: "operator", regex: /^(?:==|!=|<=|>=|&&|\|\||<<|>>|\*\*|[+\-*/%=<>!|&^~?:])/ },
  { type: "punctuation", regex: /^[{}()[\];,.]/ },
  { type: "identifier", regex: /^[A-Za-z_][A-Za-z0-9_]*/ },
  { type: "whitespace", regex: /^[ \t]+/ },
  { type: "newline", regex: /^\n/ },
];

const tokenize = (source) => {
  const tokens = [];
  let pos = 0;
  while (pos < source.length) {
    const remainder = source.slice(pos);
    let matched = null;

    for (const { type, regex } of PATTERNS) {
      const match = regex.exec(remainder);
      if (match && match.index === 0) {
        matched = { type, text: match[0] };
        break;
      }
    }

    if (!matched) {
      matched = { type: "text", text: remainder[0] };
    }

    if (matched.type === "identifier") {
      if (KEYWORDS.has(matched.text)) matched.type = "keyword";
      else if (BUILTINS.has(matched.text)) matched.type = "builtin";
    }

    tokens.push(matched);
    pos += matched.text.length;
  }
  return tokens;
};

export const tokenizeToLines = (source) => {
  const tokens = tokenize(source);
  const lines = [[]];
  for (const token of tokens) {
    if (token.type === "newline") {
      lines.push([]);
      continue;
    }
    if (token.text.includes("\n")) {
      const segments = token.text.split("\n");
      segments.forEach((segment, index) => {
        if (segment.length > 0) {
          lines[lines.length - 1].push({ type: token.type, text: segment });
        }
        if (index < segments.length - 1) {
          lines.push([]);
        }
      });
      continue;
    }
    lines[lines.length - 1].push(token);
  }
  return lines;
};
