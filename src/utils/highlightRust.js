const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "const",
  "continue",
  "crate",
  "dyn",
  "else",
  "enum",
  "extern",
  "false",
  "fn",
  "for",
  "if",
  "impl",
  "in",
  "let",
  "loop",
  "match",
  "mod",
  "move",
  "mut",
  "pub",
  "ref",
  "return",
  "self",
  "Self",
  "static",
  "struct",
  "super",
  "trait",
  "true",
  "type",
  "unsafe",
  "use",
  "where",
  "while",
  "yield",
  "macro_rules",
  "box",
]);

const BUILTINS = new Set([
  "bool",
  "char",
  "str",
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "usize",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "isize",
  "f32",
  "f64",
  "Option",
  "Some",
  "None",
  "Result",
  "Ok",
  "Err",
  "Vec",
  "String",
  "Box",
  "Rc",
  "Arc",
  "Cell",
  "RefCell",
  "HashMap",
  "BTreeMap",
  "HashSet",
  "BTreeSet",
  "Copy",
  "Clone",
  "Debug",
  "Default",
  "Eq",
  "PartialEq",
  "Ord",
  "PartialOrd",
  "Hash",
  "Iterator",
  "IntoIterator",
]);

const PATTERNS = [
  { type: "comment", regex: /^\/\/[^\n]*/ },
  { type: "comment", regex: /^\/\*[\s\S]*?\*\// },
  { type: "attribute", regex: /^#!?\[[^\]\n]*\]/ },
  { type: "string", regex: /^br?#"[\s\S]*?"#/ },
  { type: "string", regex: /^b?r?"(?:\\.|[^"\\])*"/ },
  {
    type: "char",
    regex:
      /^b?'(?:\\(?:[\\'"nrt0]|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]+\})|[^\\'\n])'/,
  },
  { type: "lifetime", regex: /^'[A-Za-z_][A-Za-z0-9_]*/ },
  {
    type: "number",
    regex:
      /^(?:0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)(?:[iu](?:8|16|32|64|128|size)|f(?:32|64))?/,
  },
  { type: "macro", regex: /^[A-Za-z_][A-Za-z0-9_]*!/ },
  {
    type: "operator",
    regex: /^(?:==|!=|<=|>=|&&|\|\||<<|>>|\.\.=?|->|=>|::|[+\-*/%=<>!|&^~?:@])/,
  },
  { type: "punctuation", regex: /^[{}()[\];,.]/ },
  { type: "identifier", regex: /^[A-Za-z_][A-Za-z0-9_]*/ },
  { type: "whitespace", regex: /^[ \t]+/ },
  { type: "newline", regex: /^\n/ },
];

const MAP_TO_CSS = {
  char: "string",
  lifetime: "constraint",
  attribute: "builtin",
  macro: "builtin",
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
    } else if (matched.type === "macro") {
      const name = matched.text.slice(0, -1);
      if (KEYWORDS.has(name)) {
        tokens.push({ type: "keyword", text: name });
        tokens.push({ type: "operator", text: "!" });
        pos += matched.text.length;
        continue;
      }
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
