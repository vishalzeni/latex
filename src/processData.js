import katex from "katex";

const INLINE_IMAGE_DATA_URL_REGEX =
  /data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=\r\n]+/i;
const INLINE_IMAGE_PLACEHOLDER = "__FP_INLINE_IMAGE_PLACEHOLDER__";
const BROKEN_KATEX_ARTIFACT_REGEX =
  /(spanclass|annotationencoding|mathxmlns|katex\s*[-\u2013\u2014\u2212]\s*(?:mathml|html)|application\/x\s*[-\u2013\u2014\u2212]\s*tex|<\s*annotation|&lt;\s*annotation)/i;
const VALID_KATEX_BLOCK_REGEX =
  /<span\b[^>]*class\s*=\s*["'][^"']*\bkatex\b(?!-)[^"']*["'][^>]*>/i;

const decodeHtmlEntities = (value = "") =>
  String(value || "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");

const stripLeadingLineBreakTokens = (value = "") =>
  String(value || "")
    .replace(/^\s*(?:\\n|\/n|\r\n|\n|\r)+\s*/gi, "")
    .trim();

const normalizeEscapedPercent = (value = "") =>
  String(value || "").replace(/\\+%/g, "%");

const normalizeBrokenBreakTags = (value = "") =>
  String(value || "")
    .replace(/<\s*br\s*\/?\s*>/gi, "<br />")
    .replace(/&lt;\s*br\s*\/?\s*&gt;/gi, "<br />");

const normalizeTextNormalCommands = (value = "") =>
  String(value || "")
    .replace(/\\(?:textnormal|testnormal)\s*\{([^{}]*)\}/gi, "__FP_TEXTNORMAL__$1__FP_TEXTNORMAL__")
    .replace(/\\(?:textnormal|testnormal)\b/gi, "__FP_TEXTNORMAL__");

const normalizeTextNormalLine = (line = "", options = {}) => {
  const { enableCodeEscape = false } = options;
  const source = String(line || "");
  const hasMarker = source.includes("__FP_TEXTNORMAL__");
  if (!hasMarker && !enableCodeEscape) return source;

  let normalized = source.replace(/__FP_TEXTNORMAL__/g, "");

  if (hasMarker) {
    normalized = normalized
      .replace(/^\s*\$\s*([\s\S]*?)\s*\$\s*$/, "$1")
      .replace(/^\s*\$\$\s*([\s\S]*?)\s*\$\$\s*$/, "$1")
      .replace(/^\s*\\\(\s*([\s\S]*?)\s*\\\)\s*$/, "$1")
      .replace(/^\s*\\\[\s*([\s\S]*?)\s*\\\]\s*$/, "$1");
  }

  normalized = normalized.replace(/\\quad\b/gi, "__FP_QUAD__");

  const shouldEscapeCode = hasMarker || (enableCodeEscape && isLikelyCodeSnippet(normalized));
  if (shouldEscapeCode) {
    normalized = escapeHtml(normalized);
  }

  return normalized.replace(/__FP_QUAD__/g, "&emsp;");
};

const normalizeTextNormalLines = (value = "", options = {}) =>
  String(value || "")
    .split("<br />")
    .map((line) => normalizeTextNormalLine(line, options))
    .join("<br />");

const splitInlineImageAndText = (value = "") => {
  const raw = String(value || "");
  if (!raw.trim()) return { image: "", text: "" };

  const imageMatch = raw.match(INLINE_IMAGE_DATA_URL_REGEX);
  if (!imageMatch) return { image: "", text: raw };

  const matchedDataUrl = String(imageMatch[0] || "");
  const imageDataUrl = matchedDataUrl.replace(/\s+/g, "");
  const matchIndex =
    typeof imageMatch.index === "number" ? imageMatch.index : raw.indexOf(matchedDataUrl);
  const safeIndex = matchIndex >= 0 ? matchIndex : 0;
  const before = raw.slice(0, safeIndex);
  const after = raw.slice(safeIndex + matchedDataUrl.length);

  return {
    image: imageDataUrl.trim(),
    text: stripLeadingLineBreakTokens(`${before}${INLINE_IMAGE_PLACEHOLDER}${after}`),
  };
};

const normalizeSqrtForms = (value = "") =>
  String(value || "")
    .replace(/\u221A\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/\u221A\s*\{([^{}]+)\}/g, "\\sqrt{$1}")
    .replace(/\u221A\s*([A-Za-z0-9.]+)/g, "\\sqrt{$1}")
    .replace(/(^|[^\\])sqrt\s*\(([^()]+)\)/gi, "$1\\sqrt{$2}")
    .replace(/(^|[^\\])sqrt\s*\{([^{}]+)\}/gi, "$1\\sqrt{$2}")
    .replace(/(^|[^\\])sqrt\s+([A-Za-z0-9.]+)/gi, "$1\\sqrt{$2}")
    .replace(/\\sqrt\s*\\([a-zA-Z]+)((?:\s*\{[^{}]*\}){1,3})/g, (_m, cmd, args) => {
      const safeCmd = String(cmd || "");
      const safeArgs = String(args || "").replace(/\s+/g, "");
      return `\\sqrt{\\${safeCmd}${safeArgs}}`;
    })
    .replace(/\\sqrt\s*\\left\s*\(([^()]+)\)\s*\\right\s*\)/g, "\\sqrt{$1}")
    .replace(/\\sqrt\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/\\sqrt\s+([A-Za-z0-9.]+)/g, "\\sqrt{$1}");

const normalizeBrokenMarkup = (value = "") =>
  decodeHtmlEntities(String(value || ""))
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\u00a0/g, " ")
    .replace(/<\s+/g, "<")
    .replace(/\s+>/g, ">")
    .replace(/<\/\s+/g, "</")
    .replace(/<spanclass/gi, "<span class")
    .replace(/<mathxmlns/gi, "<math xmlns")
    .replace(/<annotationencoding/gi, "<annotation encoding")
    .replace(/\bkatex\s*[-\u2013\u2014\u2212]\s*mathml\b/gi, "katex-mathml")
    .replace(/\bkatex\s*[-\u2013\u2014\u2212]\s*html\b/gi, "katex-html")
    .replace(/\bapplication\/x\s*[-\u2013\u2014\u2212]\s*tex\b/gi, "application/x-tex")
    .replace(/\baria\s*[-\u2013\u2014\u2212]\s*hidden\b/gi, "aria-hidden");

const escapeHtml = (value = "") =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SAFE_LATEX_EXPRESSION_REGEX = /^[A-Za-z0-9\\^_{}()[\].,+\-*/=|: ]{1,180}$/;

const normalizeSuperscriptLatex = (expression = "") =>
  String(expression || "")
    .replace(/\s+/g, "")
    .replace(/\^\{([^{}]+)\}/g, "^$1");

const removeDuplicateSuperscriptArtifacts = (value = "") => {
  let source = String(value || "");

  source = source.replace(
    /\b([A-Za-z])\s+(\d+)\s+\$([A-Za-z]\s*\^\s*\{?\d+\}?)\$/g,
    (fullMatch, looseBase, loosePower, latexExpr) => {
      const left = `${String(looseBase).toLowerCase()}^${String(loosePower)}`;
      const right = normalizeSuperscriptLatex(latexExpr).toLowerCase();
      return left === right ? ` $${normalizeSuperscriptLatex(latexExpr)}$` : fullMatch;
    },
  );

  source = source.replace(
    /\$([A-Za-z]\s*\^\s*\{?\d+\}?)\$\s+([A-Za-z])\s+(\d+)\b/g,
    (fullMatch, latexExpr, looseBase, loosePower) => {
      const left = normalizeSuperscriptLatex(latexExpr).toLowerCase();
      const right = `${String(looseBase).toLowerCase()}^${String(loosePower)}`;
      return left === right ? `$${normalizeSuperscriptLatex(latexExpr)}$ ` : fullMatch;
    },
  );

  return source.replace(/\s{2,}/g, " ").trim();
};

const extractLatexFromAnnotation = (annotationContent = "") => {
  const raw = String(annotationContent || "").trim();
  if (!raw) return "";

  const decoded = decodeHtmlEntities(raw);
  const normalized = normalizeBrokenMarkup(decoded);
  const nestedMatches = Array.from(
    normalized.matchAll(/<annotation\b[^>]*>([\s\S]*?)<\/annotation>/gi),
  )
    .map((match) => String(match?.[1] || "").trim())
    .filter(Boolean)
    .sort((a, b) => a.length - b.length);

  let candidate = nestedMatches[0] || decoded;
  candidate = decodeHtmlEntities(String(candidate || ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!candidate) return "";
  if (candidate.length > 180) return "";
  if (!SAFE_LATEX_EXPRESSION_REGEX.test(candidate)) return "";
  if (!/\\[a-zA-Z]+|[=^_{}]|[\d+\-*/]/.test(candidate)) return "";
  if (/(?:katex|mathml|annotation|spanclass|span\s*class|mathxmlns|aria\s*hidden)/i.test(candidate)) {
    return "";
  }

  const tokens = candidate.split(/\s+/).filter(Boolean);
  if (tokens.length >= 12) {
    const singleCharRatio =
      tokens.filter((token) => String(token).length <= 1).length / tokens.length;
    if (singleCharRatio > 0.6) return "";
  }

  return candidate;
};

const recoverLatexFromArtifacts = (value = "") => {
  let source = String(value || "");
  if (!BROKEN_KATEX_ARTIFACT_REGEX.test(source)) return source;

  source = normalizeBrokenMarkup(source);

  source = source.replace(
    /<annotation\b[^>]*>([\s\S]*?)<\/annotation>/gi,
    (_m, expr) => {
      const latex = extractLatexFromAnnotation(expr);
      return latex ? ` $${latex}$ ` : " ";
    },
  );

  if (/<[^>]+>/.test(source)) {
    source = source.replace(/<[^>]+>/g, " ");
  }

  source = source
    .replace(
      /\b(?:katex(?:-mathml|-html)?|semantics|mrow|mi|mn|mo|msup|msubsup|mfrac|annotationencoding|application\/x-tex|xmlns|mathml|true|false)\b/gi,
      " ",
    )
    .replace(/\s{2,}/g, " ")
    .trim();

  return removeDuplicateSuperscriptArtifacts(source);
};

const renderLatex = (expression = "", displayMode = false) => {
  const source = normalizeSqrtForms(
    String(expression || "")
      // Reduce double-escaped LaTeX commands (e.g. \\frac) but keep row breaks like \\x intact.
      .replace(/\\\\(?=[a-zA-Z]{2,}\b)/g, "\\")
      .replace(/\\([a-zA-Z]+)\s+\{/g, "\\$1{"),
  ).trim();

  if (!source) return "";

  try {
    return katex.renderToString(source, {
      throwOnError: false,
      strict: false,
      displayMode,
      output: "htmlAndMathml",
    });
  } catch {
    return source;
  }
};

const isLikelyMathExpression = (value = "") => {
  const source = String(value || "").trim();
  if (!source) return false;

  return (
    /\\[a-zA-Z]+/.test(source) ||
    /[=+\-*/^_]/.test(source) ||
    /[{}]/.test(source) ||
    /\d/.test(source)
  );
};

const isLikelyCodeSnippet = (value = "") => {
  const source = String(value || "").trim();
  if (!source) return false;

  // If the segment has LaTeX commands, prefer math rendering over code escaping.
  if (/\\[a-zA-Z]+/.test(source)) return false;

  return (
    /#\s*include/i.test(source) ||
    /\busing\s+namespace\b/i.test(source) ||
    /\bmain\s*\(/i.test(source) ||
    /\b(?:cout|cin|printf|scanf|return)\b/i.test(source) ||
    /\b(?:int|float|double|char|long|short|void|bool|string)\s+[A-Za-z_][A-Za-z0-9_]*\s*(?:\[|\(|=|;)/i.test(
      source,
    ) ||
    /[A-Za-z_][A-Za-z0-9_]*\s*\[[^\]]+\]\s*=\s*[^=]+/.test(source) ||
    /\b[A-Za-z_]+\s*\[[^\]]+\]/.test(source) ||
    /\b[A-Za-z_][A-Za-z0-9_]*\s*\([^)]*\)\s*\{?/.test(source) ||
    /<<|>>|::|->/.test(source) ||
    /;\s*$/.test(source)
  );
};

const renderExplicitLatex = (value = "") => {
  const withDollarBlock = value.replace(/\$\$((?:.|\n)*?)\$\$/g, (_m, expr) =>
    renderLatex(expr, true),
  );

  const withBlockLatex = withDollarBlock.replace(/\\\[((?:.|\n)*?)\\\]/g, (_m, expr) =>
    renderLatex(expr, true),
  );

  const withInlineLatex = withBlockLatex.replace(/\\\(((?:.|\n)*?)\\\)/g, (_m, expr) =>
    renderLatex(expr, false),
  );

  return withInlineLatex.replace(/\$([^$\n]+)\$/g, (_m, expr) => {
    const source = String(expr || "").trim();
    if (!source) return "";
    if (isLikelyMathExpression(source)) return renderLatex(source, false);
    if (isLikelyCodeSnippet(source)) return escapeHtml(source);
    return escapeHtml(source);
  });
};

const LEGACY_INLINE_LATEX_CHUNK_REGEX =
  /\\(?:sqrt(?:\[[^\]]+\])?\s*(?:\\[a-zA-Z]+(?:\s*\{[^{}]*\}){1,3}|\{(?:[^{}]|\\frac\s*\{[^{}]*\}\s*\{[^{}]*\}|\\sqrt\s*\{[^{}]*\}|\\[a-zA-Z]+(?:\s*\{[^{}]*\})?)+\}|\([^()]*\)|[A-Za-z0-9.]+)|frac\s*\{[^{}]*\}\s*\{[^{}]*\}|[a-zA-Z]+(?:\s*\{[^{}]*\})?)/g;

const renderInlineLatexChunks = (line = "") =>
  normalizeSqrtForms(String(line || "")).replace(LEGACY_INLINE_LATEX_CHUNK_REGEX, (chunk) =>
    renderLatex(chunk, false),
  );

const renderLegacyLatexLines = (value = "") =>
  value
    .split("<br />")
    .map((line) => {
      const source = String(line || "").trim();
      if (!source || source.includes("katex")) return line;

      const hasLatexCommand = /\\[a-zA-Z]+/.test(source);
      if (!hasLatexCommand) return line;

      const looksLikeTextPlusMath = /[A-Za-z]{3,}[^<]*\\[a-zA-Z]+/.test(source);
      if (looksLikeTextPlusMath) return renderInlineLatexChunks(line);

      const fullyRendered = renderLatex(source, false);
      if (fullyRendered.includes("katex-error")) return renderInlineLatexChunks(line);
      return fullyRendered;
    })
    .join("<br />");

const AUTO_INLINE_MATH_TOKEN_REGEX =
  /(?:\([^()]{1,100}\)\s*\^\s*[A-Za-z0-9+\-*/]+|[A-Za-z0-9)\]}]\s*\^\s*[A-Za-z0-9+\-*/]+|(?:\\{1,2})?(?:\u221A|sqrt)\s*(?:\([^()]{1,100}\)|\{[^{}]{1,100}\}|[A-Za-z0-9.]+))/gi;
const EXPLICIT_MATH_SEGMENT_REGEX = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$)/g;

const isExplicitMathSegment = (value = "") =>
  /^(?:\$\$[\s\S]*\$\$|\\\[[\s\S]*\\\]|\\\([\s\S]*\\\)|\$[^$\n]+\$)$/.test(
    String(value || ""),
  );

const normalizePlainMathTokenToLatex = (token = "") => {
  let source = normalizeSqrtForms(String(token || "")).trim();
  if (!source) return "";

  source = source.replace(
    /([A-Za-z0-9)\]}])\s*\^\s*\(?([A-Za-z0-9+\-*/]+)\)?/g,
    (_m, base, exponent) => `${base}^{${exponent}}`,
  );

  return source;
};

const renderAutoInlineMathTokens = (value = "") =>
  value
    .split("<br />")
    .map((line) => {
      const source = String(line || "");
      if (!source || source.includes("katex")) return line;

      return source
        .split(EXPLICIT_MATH_SEGMENT_REGEX)
        .map((segment) => {
          if (!segment) return "";
          if (isExplicitMathSegment(segment)) return segment;

          return segment.replace(AUTO_INLINE_MATH_TOKEN_REGEX, (token) => {
            const latexSource = normalizePlainMathTokenToLatex(token);
            if (!latexSource) return token;
            return renderLatex(latexSource, false);
          });
        })
        .join("");
    })
    .join("<br />");

export const processData = (input = "") => {
  const { image: inlineImageDataUrl, text: rawText } = splitInlineImageAndText(input);
  let examData = String(rawText || "");
  const hasTextNormalCommand = /\\(?:textnormal|testnormal)\b/i.test(examData);

  examData = recoverLatexFromArtifacts(examData);
  examData = normalizeBrokenBreakTags(examData);
  examData = normalizeTextNormalCommands(examData);

  if (VALID_KATEX_BLOCK_REGEX.test(examData) && !BROKEN_KATEX_ARTIFACT_REGEX.test(examData)) {
    examData = normalizeTextNormalLines(examData, {
      enableCodeEscape: hasTextNormalCommand,
    });
    examData = examData.replace(/__FP_TEXTNORMAL__/g, "");
    examData = normalizeEscapedPercent(examData);
    if (inlineImageDataUrl) {
      const imageHtml = `<img src="${inlineImageDataUrl}" alt="Question visual" class="fp-inline-question-image" />`;
      return examData ? `${imageHtml}<br />${examData}` : imageHtml;
    }
    return examData;
  }

  // Only convert standalone "\n" tokens to line breaks so LaTeX commands like \nabla stay valid.
  examData = examData
    .replace(/(^|[\s>])\\n(?=$|[\s<])/g, "$1<br />")
    .replace(/\r\n|\n|\r/g, "<br />");
  examData = examData.replace(/(^|\s)\/n(?=\s|$)/gi, "$1<br />");
  examData = normalizeTextNormalLines(examData, {
    enableCodeEscape: hasTextNormalCommand,
  });

  examData = examData.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  examData = examData.replace(/~(.*?)~/g, "<u>$1</u>");

  if (hasTextNormalCommand) {
    examData = examData.replace(/__FP_TEXTNORMAL__/g, "");
    examData = normalizeEscapedPercent(examData);

    if (inlineImageDataUrl) {
      const imageHtml = `<img src="${inlineImageDataUrl}" alt="Question visual" class="fp-inline-question-image" />`;
      if (examData.includes(INLINE_IMAGE_PLACEHOLDER)) {
        return examData.replace(INLINE_IMAGE_PLACEHOLDER, imageHtml);
      }
      return examData ? `${imageHtml}<br />${examData}` : imageHtml;
    }

    return examData;
  }

  examData = renderAutoInlineMathTokens(examData);
  examData = renderExplicitLatex(examData);
  examData = renderLegacyLatexLines(examData);
  examData = examData.replace(/__FP_TEXTNORMAL__/g, "");
  examData = normalizeEscapedPercent(examData);

  if (inlineImageDataUrl) {
    const imageHtml = `<img src="${inlineImageDataUrl}" alt="Question visual" class="fp-inline-question-image" />`;
    if (examData.includes(INLINE_IMAGE_PLACEHOLDER)) {
      return examData.replace(INLINE_IMAGE_PLACEHOLDER, imageHtml);
    }
    return examData ? `${imageHtml}<br />${examData}` : imageHtml;
  }

  return examData;
};
