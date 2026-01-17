import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Stack,
  Divider,
  TextField,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { ContentCopy, Preview, Code } from "@mui/icons-material";
import RenderHTML from "./RenderHTML";

const examples = [
  {
    title: "Inline Fractions & Powers",
    code: "x^2 + x_1 + x^{n+1} + a_b^c + x^{2n-1}",
  },
  {
    title: "Basic Fractions & Roots",
    code: "\\frac{a}{b}, \\sqrt{x}, \\sqrt[3]{y}, \\frac{d}{dx}x^n = nx^{n-1}",
  },
  {
    title: "Greek Letters & Symbols",
    code:
      "\\alpha, \\beta, \\gamma, \\pi, \\theta, \\Delta, \\infty, \\partial, " +
      "\\nabla, \\forall, \\exists, \\neg, \\Rightarrow, \\implies, \\iff, " +
      "\\leq, \\geq, \\neq, \\approx, \\propto, \\subset, \\supset, \\in, " +
      "\\notin, \\cup, \\cap, \\emptyset, \\mathbb{R}, \\mathbb{N}, \\mathbb{Z}",
  },
  {
    title: "Display Integral",
    code: "\\int_{-\\infty}^{\\infty} e^{-x^{2}}\\,dx = \\sqrt{\\pi}",
  },
  {
    title: "Piecewise Function",
    code: "f(x) = \\begin{cases} x^2, & x < 0 \\\\ x, & 0 \\le x < 1 \\\\ 1, & x \\ge 1 \\end{cases}",
  },
  {
    title: "Matrix & Determinant",
    code:
      "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}, " +
      "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix} = ad - bc",
  },
  {
    title: "Continued Fractions",
    code: "a_0 + \\cfrac{1}{a_1 + \\cfrac{1}{a_2 + \\cfrac{1}{a_3}}}",
  },
  {
    title: "Substack & Multiline Sums",
    code: "\\sum_{\\substack{0\\leq i\\leq m \\\\ 0<j<n}} i^j",
  },
  {
    title: "Text in Math & Color",
    code:
      "E = mc^2, \\text{where } m = \\text{mass},\\; c = \\text{speed of light},\\; " +
      "\\color{red}{\\text{important}}",
  },
  {
    title: "Boxed & Cancelled",
    code: "\\boxed{a^2 + b^2 = c^2}, \\cancel{x}, \\bcancel{y}, \\xcancel{z}",
  },
];

export default function MathGuide() {
  const [liveInput, setLiveInput] = useState("");
  const theme = useTheme();

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    // Use a more professional notification (e.g., Snackbar) in a real app
    alert("Copied to clipboard!");
  };

  const getLivePreviewContent = (input) => {
    if (!input.trim()) return "";
    if (
      /\$.*\$/.test(input) ||
      /\\\[.*\\\]/.test(input) ||
      /<.*?>/.test(input) ||
      /\\begin\{.*?}/.test(input)
    ) {
      return input;
    }
    return `$${input}$`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        bgcolor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        fontWeight={700}
        color="text.primary"
        sx={{
          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
          textAlign: "center",
        }}
      >
        🧮 MathJax Guide – Equation Patterns
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{
          mb: { xs: 3, sm: 4, md: 5 },
          textAlign: "center",
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
        }}
      >
        A collection of commonly used{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", fontWeight: 600 }}
          display="inline"
        >
          LaTeX
        </Box>{" "}
        math patterns with{" "}
        <Box
          component="span"
          sx={{ color: "secondary.main", fontWeight: 600 }}
          display="inline"
        >
          live preview
        </Box>
      </Typography>

      {/* Live Preview Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 3, sm: 4, md: 5 },
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
            color: "text.primary",
          }}
        >
          <Preview sx={{ mr: 1, color: "primary.main" }} />
          Live Preview
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
          }}
        >
          Type{" "}
          <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
            LaTeX
          </Box>{" "}
          below to see instant rendering
        </Typography>

        <TextField
          value={liveInput}
          onChange={(e) => setLiveInput(e.target.value)}
          placeholder="Type or paste LaTeX here..."
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          inputProps={{ "aria-label": "LaTeX input for live preview" }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              bgcolor: theme.palette.background.default,
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <Divider sx={{ my: 2, borderColor: theme.palette.divider }} />

        <Box
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            lineHeight: 1.8,
            minHeight: 80,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            bgcolor: liveInput ? "transparent" : theme.palette.action.hover,
            border: liveInput
              ? "none"
              : `1px dashed ${theme.palette.divider}`,
            display: "flex",
            alignItems: liveInput ? "flex-start" : "center",
            justifyContent: liveInput ? "flex-start" : "center",
            color: "text.primary",
            overflowX: "auto",
          }}
        >
          {liveInput ? (
            <RenderHTML content={getLivePreviewContent(liveInput)} />
          ) : (
            <Typography color="text.disabled">
              Preview will appear here
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Example Snippets */}
      <Typography
        variant="h6"
        sx={{
          mb: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          color: "text.primary",
          fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
        }}
      >
        <Code sx={{ mr: 1, color: "secondary.main" }} />
        Example Patterns
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
        }}
      >
        Click the{" "}
        <Box component="span" sx={{ color: "primary.main", fontWeight: 600 }}>
          copy
        </Box>{" "}
        icon to use any of these patterns
      </Typography>

      <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
        {examples.map(({ title, code }, idx) => (
          <Paper
            key={idx}
            elevation={2}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "box-shadow 0.3s, border-color 0.3s",
              "&:hover": {
                boxShadow: theme.shadows[4],
                borderColor: theme.palette.primary.light,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                }}
              >
                {title}
              </Typography>
              <Tooltip title="Copy LaTeX Code">
                <IconButton
                  onClick={() => handleCopy(code)}
                  size="small"
                  aria-label={`Copy ${title} LaTeX code`}
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                mb: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                bgcolor: theme.palette.action.hover,
                position: "relative",
                overflowX: "auto",
                "&:before": {
                  position: "absolute",
                  top: -10,
                  left: 8,
                  fontSize: { xs: 9, sm: 10 },
                  bgcolor: theme.palette.background.paper,
                  px: 0.5,
                  color: "secondary.main",
                  fontWeight: 600,
                  letterSpacing: 1,
                },
              }}
            >
              <Typography
                variant="body2"
                fontFamily="monospace"
                whiteSpace="pre-wrap"
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
                }}
              >
                {code}
              </Typography>
            </Box>

            <Box
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                lineHeight: 1.7,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1,
                bgcolor: theme.palette.background.default,
                color: "text.primary",
                minHeight: 50,
                overflowX: "auto",
              }}
            >
              <RenderHTML content={getLivePreviewContent(code)} />
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}