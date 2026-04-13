import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ContentCopy, PlaylistAdd, RestartAlt } from "@mui/icons-material";
import RenderHTML from "./RenderHTML";

const EASY_EQUATIONS = [
  { title: "Linear Equation", code: "2x + 3 = 11" },
  { title: "Quadratic Standard", code: "x^2 - 5x + 6 = 0" },
  { title: "Quadratic Formula", code: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
  { title: "Cube Expansion", code: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3" },
  { title: "Simple Fraction", code: "\\frac{a}{b} + \\frac{c}{d}" },
  { title: "Nested Fraction", code: "\\frac{1}{1+\\frac{1}{x}}" },
  { title: "Square Root", code: "\\sqrt{x^2+1}" },
  { title: "Cube Root", code: "\\sqrt[3]{8x}" },
  { title: "Power Notation", code: "x^{2n-1} + y^{m+2}" },
  { title: "Log Rule", code: "\\log(xy)=\\log x + \\log y" },
  { title: "Natural Log", code: "\\ln(e^x)=x" },
  { title: "Trig Identity", code: "\\sin^2\\theta + \\cos^2\\theta = 1" },
  { title: "Tangent Identity", code: "1+\\tan^2x=\\sec^2x" },
  { title: "Basic Limit", code: "\\lim_{x\\to0}\\frac{\\sin x}{x}=1" },
  { title: "Simple Derivative", code: "\\frac{d}{dx}(x^n)=nx^{n-1}" },
  { title: "Simple Integral", code: "\\int x^2 dx = \\frac{x^3}{3}+C" },
  { title: "Definite Integral", code: "\\int_0^1 x^2 dx = \\frac{1}{3}" },
  { title: "Summation", code: "\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}" },
  { title: "Product", code: "\\prod_{k=1}^{n}k=n!" },
  { title: "Binomial Coefficient", code: "\\binom{n}{r}=\\frac{n!}{r!(n-r)!}" },
  { title: "Permutation", code: "{}^nP_r=\\frac{n!}{(n-r)!}" },
  { title: "Combination", code: "{}^nC_r=\\frac{n!}{r!(n-r)!}" },
  { title: "Probability", code: "P(A|B)=\\frac{P(A\\cap B)}{P(B)}" },
  { title: "Mean", code: "\\bar{x}=\\frac{x_1+x_2+\\cdots+x_n}{n}" },
  { title: "Variance", code: "\\operatorname{Var}(X)=E[X^2]-E[X]^2" },
  { title: "Set Builder", code: "A=\\{x\\in\\mathbb{R}:x>0\\}" },
  { title: "Union and Intersection", code: "A\\cup B,\\;A\\cap B" },
  { title: "Subset", code: "A\\subseteq B" },
  { title: "Modulo", code: "a \\equiv b \\pmod{m}" },
  { title: "Floor Ceiling", code: "\\lfloor x \\rfloor,\\;\\lceil x \\rceil" },
  { title: "Distance Formula", code: "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}" },
  { title: "Circle Equation", code: "(x-h)^2+(y-k)^2=r^2" },
  { title: "Dot Product", code: "\\vec{a}\\cdot\\vec{b}=|a||b|\\cos\\theta" },
  { title: "2x2 Matrix", code: "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}" },
  { title: "Determinant 2x2", code: "\\det\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}=ad-bc" },
  { title: "Piecewise", code: "f(x)=\\begin{cases}x^2,&x<0\\\\x,&x\\ge0\\end{cases}" },
  { title: "Equation with Newline", code: "Given: $x+y=10$ \\n Also: $x-y=2$" },
  { title: "Step Style Newline", code: "Step 1: Assume value \\n Step 2: Substitute formula \\n Step 3: Final answer" },
];

const HARD_EQUATIONS = [
  { title: "Improper Integral", code: "\\int_{-\\infty}^{\\infty} e^{-x^2}dx=\\sqrt{\\pi}" },
  { title: "Double Integral", code: "\\iint_R (x+y)\\,dA" },
  { title: "Triple Integral", code: "\\iiint_V (x^2+y^2+z^2)\\,dV" },
  { title: "Contour Integral", code: "\\oint_C f(z)\\,dz=2\\pi i\\sum\\operatorname{Res}(f,a_k)" },
  { title: "Partial Derivative", code: "\\frac{\\partial z}{\\partial x}=2x+3y" },
  { title: "Mixed Partial", code: "\\frac{\\partial^2 z}{\\partial x\\partial y}" },
  { title: "Second Order ODE", code: "\\frac{d^2y}{dx^2}+\\omega^2y=0" },
  { title: "Heat Equation", code: "\\frac{\\partial u}{\\partial t}=\\alpha^2\\frac{\\partial^2 u}{\\partial x^2}" },
  { title: "Wave Equation", code: "\\frac{\\partial^2 u}{\\partial t^2}=c^2\\frac{\\partial^2 u}{\\partial x^2}" },
  { title: "Laplacian", code: "\\nabla^2\\phi=\\frac{\\partial^2\\phi}{\\partial x^2}+\\frac{\\partial^2\\phi}{\\partial y^2}+\\frac{\\partial^2\\phi}{\\partial z^2}" },
  { title: "Divergence", code: "\\nabla\\cdot\\vec{F}=\\frac{\\partial F_x}{\\partial x}+\\frac{\\partial F_y}{\\partial y}+\\frac{\\partial F_z}{\\partial z}" },
  { title: "Curl", code: "\\nabla\\times\\vec{F}" },
  { title: "Stokes Theorem", code: "\\oint_C\\vec{F}\\cdot d\\vec{r}=\\iint_S(\\nabla\\times\\vec{F})\\cdot d\\vec{S}" },
  { title: "Gauss Divergence Theorem", code: "\\iiint_V(\\nabla\\cdot\\vec{F})dV=\\iint_S\\vec{F}\\cdot d\\vec{S}" },
  { title: "Fourier Series", code: "f(x)=\\frac{a_0}{2}+\\sum_{n=1}^{\\infty}(a_n\\cos nx+b_n\\sin nx)" },
  { title: "Laplace Transform", code: "\\mathcal{L}\\{f(t)\\}=\\int_0^{\\infty}e^{-st}f(t)dt" },
  { title: "Inverse Laplace", code: "f(t)=\\mathcal{L}^{-1}\\{F(s)\\}" },
  { title: "Taylor Series", code: "f(x)=\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n" },
  { title: "Maclaurin Series", code: "e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}" },
  { title: "Continued Fraction", code: "a_0+\\cfrac{1}{a_1+\\cfrac{1}{a_2+\\cfrac{1}{a_3}}}" },
  { title: "Substack Sum", code: "\\sum_{\\substack{0\\le i\\le m\\\\0<j<n}}i^j" },
  { title: "Matrix Inverse", code: "A^{-1}=\\frac{1}{\\det(A)}\\operatorname{adj}(A)" },
  { title: "Eigen Value Equation", code: "A\\mathbf{v}=\\lambda\\mathbf{v}" },
  { title: "Characteristic Polynomial", code: "\\det(A-\\lambda I)=0" },
  { title: "SVD Form", code: "A=U\\Sigma V^T" },
  { title: "Bayes Continuous", code: "f_{X|Y}(x|y)=\\frac{f_{Y|X}(y|x)f_X(x)}{f_Y(y)}" },
  { title: "Normal PDF", code: "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}" },
  { title: "Covariance Matrix", code: "\\Sigma=E[(X-\\mu)(X-\\mu)^T]" },
  { title: "Chi Square", code: "\\chi^2=\\sum\\frac{(O_i-E_i)^2}{E_i}" },
  { title: "Euler Totient", code: "a^{\\varphi(n)}\\equiv1\\pmod{n}" },
  { title: "Chinese Remainder", code: "x\\equiv a_1\\pmod{n_1},\\;x\\equiv a_2\\pmod{n_2}" },
  { title: "Residue Formula", code: "\\operatorname{Res}(f,a)=\\frac{1}{(m-1)!}\\lim_{z\\to a}\\frac{d^{m-1}}{dz^{m-1}}[(z-a)^mf(z)]" },
  { title: "Gamma Function", code: "\\Gamma(s)=\\int_0^{\\infty}x^{s-1}e^{-x}dx" },
  { title: "Beta Function", code: "B(p,q)=\\int_0^1 t^{p-1}(1-t)^{q-1}dt" },
  { title: "Riemann Zeta", code: "\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}" },
  { title: "Tensor Notation", code: "T_{ij}=\\frac{\\partial x_i}{\\partial y_j}" },
  { title: "Aligned System", code: "\\begin{aligned}2x+y&=7\\\\x-y&=1\\end{aligned}" },
  { title: "Advanced Newline Block", code: "Given: $\\int_0^1 x^2dx$ \\n Apply antiderivative \\n Evaluate limits \\n Final: $\\frac{1}{3}$" },
];

const DEFAULT_SNIPPET = "";

const hasExplicitMathDelimiter = (value = "") =>
  /(\$\$[\s\S]*\$\$|\\\([\s\S]*\\\)|\\\[[\s\S]*\\\]|\$[^$\n]+\$)/.test(String(value || ""));

const toWebsiteReadyLatex = (value = "") => {
  const source = String(value || "").trim();
  if (!source) return "";
  if (hasExplicitMathDelimiter(source)) return source;

  // Keep only standalone "\n" tokens as plain text blocks; commands like "\nabla" must still render as math.
  if (/(^|[\s>])\\n(?=$|[\s<])/g.test(source)) return source;

  const mathLike = /\\[a-zA-Z]+|[=^_+\-*/]|[0-9]/.test(source);
  return mathLike ? `$${source}$` : source;
};

const copyToClipboard = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // Ignore clipboard errors in restricted browsers.
  }
};

const EquationList = ({ title, helper, items, onUse }) => (
  <Paper
    sx={{
      borderRadius: 2.5,
      border: "1px solid",
      borderColor: "#e2e8f0",
      minHeight: 0,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
    }}
  >
    <Box sx={{ p: { xs: 1, md: 1.2 }, borderBottom: "1px solid", borderColor: "#e2e8f0" }}>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.84rem", md: "0.92rem", xl: "0.98rem" } }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: { xs: "0.72rem", md: "0.8rem" } }}>
        {helper}
      </Typography>
    </Box>

    <Box sx={{ p: { xs: 0.8, md: 1 }, overflowY: "auto", minHeight: 0 }}>
      <Stack spacing={0.9}>
        {items.map((item) => {
          const normalizedCode = toWebsiteReadyLatex(item.code);

          return (
            <Paper
              key={item.title}
              variant="outlined"
              sx={{
                p: 0.85,
                borderRadius: 1.75,
                borderColor: "#dbe5f3",
                background: "#fbfdff",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.6}>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.76rem", md: "0.84rem" } }}>
                  {item.title}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onUse(normalizedCode)}
                  startIcon={<PlaylistAdd sx={{ fontSize: 15 }} />}
                  sx={{
                    minWidth: "unset",
                    px: 0.9,
                    py: 0.22,
                    fontSize: "0.72rem",
                    borderRadius: 999,
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                    borderColor: "#bfdbfe",
                    color: "#1d4ed8",
                    bgcolor: "rgba(239,246,255,0.9)",
                  }}
                >
                  Use in Editor
                </Button>
              </Stack>

              <Box
                component="pre"
                sx={{
                  m: 0,
                  mt: 0.52,
                  p: 0.65,
                  fontSize: { xs: "0.74rem", md: "0.82rem", xl: "0.86rem" },
                  borderRadius: 1.2,
                  bgcolor: "#f1f5f9",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                }}
              >
                {normalizedCode}
              </Box>

              <Box
                sx={{
                  mt: 0.58,
                  p: 0.65,
                  borderRadius: 1.2,
                  background: "#ffffff",
                  border: "1px dashed #cbd5e1",
                  overflowX: "auto",
                }}
              >
                <RenderHTML content={normalizedCode} sx={{ fontSize: { xs: "1rem", md: "1.1rem", xl: "1.16rem" } }} />
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  </Paper>
);

export default function MathGuide() {
  const [liveInput, setLiveInput] = useState(DEFAULT_SNIPPET);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        height: "100vh",
        minHeight: "100vh",
        overflow: { xs: "auto", lg: "hidden" },
        p: { xs: 1, sm: 1.2, md: 1.5, xl: 1.8 },
        background: "linear-gradient(160deg, #eef2f7 0%, #f8fafc 45%, #edf6ff 100%)",
      }}
    >
      <Grid container spacing={{ xs: 1, md: 1.3 }} sx={{ height: { lg: "100%" } }}>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ height: { lg: "100%" }, minWidth: 0 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1.1, md: 1.45, xl: 1.8 },
              borderRadius: 3.2,
              border: "1px solid #dce7f5",
              height: { lg: "100%" },
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              minWidth: 0,
              background: "#ffffff",
              boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={1}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    letterSpacing: -0.2,
                    color: "#0f172a",
                    fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.42rem", xl: "1.62rem" },
                  }}
                >
                  Freepare Equation Composer
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.86rem", md: "0.94rem", xl: "1rem" } }}
                >
                  Create and preview exactly the way Freepare renders equations.
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: { xs: 1, md: 1.2 } }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateRows: { xs: "320px 320px", sm: "340px 340px", lg: "1fr 1fr" },
                gap: 1,
                flex: 1,
                minHeight: 0,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 0.9, md: 1.1 },
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  borderColor: "#dbe5f3",
                  background: "#f8fafc",
                }}
              >
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "0.95rem", md: "1.08rem", xl: "1.14rem" }, mb: 0.6 }}>
                  Input Editor
                </Typography>
                <Box
                  component="textarea"
                  value={liveInput}
                  onChange={(event) => setLiveInput(event.target.value)}
                  placeholder="Paste raw latex/question text here..."
                  sx={{
                    width: "100%",
                    flex: 1,
                    borderRadius: 1.5,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#0f172a",
                    resize: "none",
                    outline: "none",
                    p: { xs: 1, md: 1.2 },
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                    fontSize: { xs: "0.84rem", sm: "0.92rem", md: "1.02rem", xl: "1.08rem" },
                    lineHeight: 1.55,
                    overflow: "auto",
                    "&:focus": {
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(37,99,235,0.14)",
                    },
                  }}
                />
                <Typography color="text.secondary" sx={{ mt: 0.6, fontSize: { xs: "0.74rem", md: "0.82rem" } }}>
                  Character count: {liveInput.length}
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 0.9, md: 1.1 },
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  borderColor: "#dbe5f3",
                  background: "#f8fafc",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={0.6}
                  sx={{ mb: 0.6 }}
                >
                  <Typography
                    sx={{ fontWeight: 800, fontSize: { xs: "0.95rem", md: "1.08rem", xl: "1.14rem" } }}
                  >
                    Live Preview
                  </Typography>
                  <Stack direction="row" spacing={0.6} sx={{ flexShrink: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<RestartAlt />}
                      onClick={() => setLiveInput(DEFAULT_SNIPPET)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        px: { xs: 1.1, md: 1.35 },
                        fontSize: { xs: "0.72rem", md: "0.8rem" },
                        whiteSpace: "nowrap",
                        boxShadow: "none",
                        color: "#0f172a",
                        background: "linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%)",
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(liveInput)}
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 700,
                        px: { xs: 1.1, md: 1.35 },
                        fontSize: { xs: "0.72rem", md: "0.8rem" },
                        whiteSpace: "nowrap",
                        background: "linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)",
                      }}
                    >
                      Copy LaTeX Code
                    </Button>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    p: { xs: 0.9, md: 1 },
                    border: "1px dashed #94a3b8",
                    borderRadius: 1.5,
                    background: "#ffffff",
                  }}
                >
                  {liveInput.trim() ? (
                    <RenderHTML
                      content={liveInput}
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.08rem",
                          md: "1.18rem",
                          xl: "1.28rem",
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Preview will appear here.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>

            <Alert
              severity="info"
              sx={{
                mt: 1,
                fontSize: { xs: "0.7rem", md: "0.78rem" },
                border: "1px solid #dbe5f3",
                background: "#f8fafc",
              }}
            >
              Best practice: use <code>$...$</code>, <code>\\(...\\)</code>, and <code>$$...$$</code>.
            </Alert>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }} sx={{ height: { lg: "100%" }, minWidth: 0 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1, md: 1.15, xl: 1.35 },
              borderRadius: 3.2,
              border: "1px solid #dbe5f3",
              height: { lg: "100%" },
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              minWidth: 0,
              background: "#ffffff",
              boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                fontSize: { xs: "1.02rem", sm: "1.12rem", md: "1.24rem", xl: "1.32rem" },
              }}
            >
              Freepare Equation Sidebar
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: { xs: "0.78rem", md: "0.88rem" }, mb: 0.8 }}>
              Every equation has code + preview. Use in editor in one click.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 0.9,
                flex: 1,
                minHeight: 0,
                minWidth: 0,
              }}
            >
              <EquationList
                title="Easy Daily Use"
                helper={`${EASY_EQUATIONS.length} equations`}
                items={EASY_EQUATIONS}
                onUse={setLiveInput}
              />
              <EquationList
                title="Hard Advanced"
                helper={`${HARD_EQUATIONS.length} equations`}
                items={HARD_EQUATIONS}
                onUse={setLiveInput}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
