const KEYWORDS = new Set([
  "alloc_locals",
  "as",
  "assert",
  "break",
  "const",
  "continue",
  "do",
  "dw",
  "else",
  "end",
  "enum",
  "extern",
  "false",
  "fn",
  "for",
  "from",
  "func",
  "if",
  "impl",
  "implicit",
  "import",
  "in",
  "let",
  "local",
  "loop",
  "match",
  "member",
  "mod",
  "mut",
  "namespace",
  "nondet",
  "of",
  "pub",
  "ref",
  "return",
  "self",
  "Self",
  "static",
  "static_assert",
  "struct",
  "super",
  "tempvar",
  "trait",
  "true",
  "type",
  "use",
  "using",
  "while",
  "with",
  "with_attr",
]);

const BUILTINS = new Set([
  "felt",
  "felt252",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "u256",
  "usize",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "bool",
  "ByteArray",
  "Array",
  "Span",
  "Option",
  "Some",
  "None",
  "Result",
  "Ok",
  "Err",
  "Box",
  "Nullable",
  "ContractAddress",
  "ClassHash",
  "HashState",
  "Copy",
  "Drop",
  "Clone",
  "Default",
  "PartialEq",
  "Serde",
  "Hash",
]);

const PATTERNS = [
  { type: "comment", regex: /^\/\/[^\n]*/ },
  { type: "comment", regex: /^\/\*[\s\S]*?\*\// },
  { type: "attribute", regex: /^#\[[^\]\n]*\]/ },
  { type: "string", regex: /^"(?:\\.|[^"\\\n])*"/ },
  { type: "string", regex: /^'(?:\\.|[^'\\\n])*'/ },
  {
    type: "number",
    regex:
      /^(?:0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)(?:_(?:felt252|u(?:8|16|32|64|128|256|size)|i(?:8|16|32|64|128)))?/,
  },
  {
    type: "operator",
    regex:
      /^(?:==|!=|<=|>=|&&|\|\||<<|>>|->|=>|::|\*\*|\.\.=?|[+\-*/%=<>!|&^~?:@])/,
  },
  { type: "punctuation", regex: /^[{}()[\];,.]/ },
  { type: "identifier", regex: /^[A-Za-z_][A-Za-z0-9_]*/ },
  { type: "whitespace", regex: /^[ \t]+/ },
  { type: "newline", regex: /^\n/ },
];

const MAP_TO_CSS = {
  attribute: "builtin",
};

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

    if (MAP_TO_CSS[matched.type]) {
      matched.type = MAP_TO_CSS[matched.type];
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
