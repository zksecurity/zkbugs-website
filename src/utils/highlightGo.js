const KEYWORDS = new Set([
  "break",
  "case",
  "chan",
  "const",
  "continue",
  "default",
  "defer",
  "else",
  "fallthrough",
  "for",
  "func",
  "go",
  "goto",
  "if",
  "import",
  "interface",
  "map",
  "package",
  "range",
  "return",
  "select",
  "struct",
  "switch",
  "type",
  "var",
]);

const BUILTINS = new Set([
  "bool",
  "byte",
  "rune",
  "string",
  "int",
  "int8",
  "int16",
  "int32",
  "int64",
  "uint",
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "uintptr",
  "float32",
  "float64",
  "complex64",
  "complex128",
  "error",
  "any",
  "comparable",
  "true",
  "false",
  "nil",
  "iota",
  "append",
  "cap",
  "close",
  "complex",
  "copy",
  "delete",
  "imag",
  "len",
  "make",
  "new",
  "panic",
  "print",
  "println",
  "real",
  "recover",
]);

const PATTERNS = [
  { type: "comment", regex: /^\/\/[^\n]*/ },
  { type: "comment", regex: /^\/\*[\s\S]*?\*\// },
  { type: "string", regex: /^`[^`]*`/ },
  { type: "string", regex: /^"(?:\\.|[^"\\\n])*"/ },
  { type: "string", regex: /^'(?:\\.|[^'\\\n])*'/ },
  {
    type: "number",
    regex:
      /^(?:0x[0-9a-fA-F_]+|0o?[0-7_]+|0b[01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)i?/,
  },
  {
    type: "operator",
    regex:
      /^(?:==|!=|<=|>=|&&|\|\||<-|<<=?|>>=?|\+\+|--|\.\.\.|:=|&\^=?|[+\-*/%=<>!|&^~?:])/,
  },
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
