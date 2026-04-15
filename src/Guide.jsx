import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Category, ContentCopy, PlaylistAdd, RestartAlt } from "@mui/icons-material";
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
  {
    title: "Square Bracket Rational Form",
    code: "\\left[\\frac{x+\\frac{1}{x^2}}{x-\\frac{1}{x^2+1}}\\right]+m\\sqrt{3}",
  },
  {
    title: "Round Bracket Rational Form",
    code: "\\left(\\frac{x+\\frac{1}{x^2}}{x-\\frac{1}{x^2+1}}\\right)+m\\sqrt{3}",
  },
  {
    title: "Curly Bracket Rational Form",
    code: "\\left\\{\\frac{x+\\frac{1}{x^2}}{x-\\frac{1}{x^2+1}}\\right\\}+m\\sqrt{3}",
  },
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

const SYMBOL_GROUPS = [
  {
    title: "Reference Symbols",
    helper: "From your attached sample",
    items: [
      { symbol: "\u03c0", label: "Pi", code: "\\pi" },
      { symbol: "\u00b1", label: "Plus Minus", code: "\\pm" },
      { symbol: "\u21d2", label: "Implies", code: "\\Rightarrow" },
      { symbol: "\u2192", label: "Arrow", code: "\\rightarrow" },
      { symbol: "\u2265", label: "Greater or Equal", code: "\\ge" },
      { symbol: "\u2264", label: "Less or Equal", code: "\\le" },
      { symbol: "\u2234", label: "Therefore", code: "\\therefore" },
    ],
  },
  {
    title: "Arithmetic Operators",
    helper: "Basic and advanced operators",
    items: [
      { symbol: "+", label: "Plus", code: "+" },
      { symbol: "-", label: "Minus", code: "-" },
      { symbol: "\u00d7", label: "Multiply", code: "\\times" },
      { symbol: "\u00f7", label: "Divide", code: "\\div" },
      { symbol: "\u00b7", label: "Dot Product Dot", code: "\\cdot" },
      { symbol: "\u2217", label: "Asterisk Product", code: "\\ast" },
      { symbol: "\u22c6", label: "Star Product", code: "\\star" },
      { symbol: "\u2218", label: "Composition", code: "\\circ" },
      { symbol: "\u00b1", label: "Plus Minus", code: "\\pm" },
      { symbol: "\u2213", label: "Minus Plus", code: "\\mp" },
      { symbol: "\u2295", label: "Direct Sum", code: "\\oplus" },
      { symbol: "\u2296", label: "Circled Minus", code: "\\ominus" },
      { symbol: "\u2297", label: "Circled Times", code: "\\otimes" },
      { symbol: "\u2298", label: "Circled Divide", code: "\\oslash" },
      { symbol: "\u2299", label: "Circled Dot", code: "\\odot" },
      { symbol: "\u221a", label: "Square Root", code: "\\sqrt{x}" },
    ],
  },
  {
    title: "Relations and Comparison",
    helper: "Equality and ordering symbols",
    items: [
      { symbol: "=", label: "Equal", code: "=" },
      { symbol: "\u2260", label: "Not Equal", code: "\\neq" },
      { symbol: "\u2248", label: "Approximately Equal", code: "\\approx" },
      { symbol: "\u2245", label: "Congruent", code: "\\cong" },
      { symbol: "\u2243", label: "Asymptotically Equal", code: "\\simeq" },
      { symbol: "\u223c", label: "Similar", code: "\\sim" },
      { symbol: "\u2261", label: "Equivalent", code: "\\equiv" },
      { symbol: "<", label: "Less Than", code: "<" },
      { symbol: ">", label: "Greater Than", code: ">" },
      { symbol: "\u2264", label: "Less or Equal", code: "\\leq" },
      { symbol: "\u2265", label: "Greater or Equal", code: "\\geq" },
      { symbol: "\u226a", label: "Much Less Than", code: "\\ll" },
      { symbol: "\u226b", label: "Much Greater Than", code: "\\gg" },
      { symbol: "\u221d", label: "Proportional To", code: "\\propto" },
      { symbol: "\u2223", label: "Divides", code: "\\mid" },
      { symbol: "\u2224", label: "Not Divides", code: "\\nmid" },
      { symbol: "\u2225", label: "Parallel", code: "\\parallel" },
      { symbol: "\u2226", label: "Not Parallel", code: "\\nparallel" },
      { symbol: "\u22a5", label: "Perpendicular", code: "\\perp" },
    ],
  },
  {
    title: "Arrows",
    helper: "Direction and implication symbols",
    items: [
      { symbol: "\u2190", label: "Left Arrow", code: "\\leftarrow" },
      { symbol: "\u2192", label: "Right Arrow", code: "\\rightarrow" },
      { symbol: "\u2194", label: "Left Right Arrow", code: "\\leftrightarrow" },
      { symbol: "\u2191", label: "Up Arrow", code: "\\uparrow" },
      { symbol: "\u2193", label: "Down Arrow", code: "\\downarrow" },
      { symbol: "\u21d0", label: "Left Implies", code: "\\Leftarrow" },
      { symbol: "\u21d2", label: "Right Implies", code: "\\Rightarrow" },
      { symbol: "\u21d4", label: "Equivalent Implies", code: "\\Leftrightarrow" },
      { symbol: "\u21a6", label: "Maps To", code: "\\mapsto" },
      { symbol: "\u21a9", label: "Hook Left Arrow", code: "\\hookleftarrow" },
      { symbol: "\u21aa", label: "Hook Right Arrow", code: "\\hookrightarrow" },
      { symbol: "\u2197", label: "North East Arrow", code: "\\nearrow" },
      { symbol: "\u2198", label: "South East Arrow", code: "\\searrow" },
      { symbol: "\u2196", label: "North West Arrow", code: "\\nwarrow" },
      { symbol: "\u2199", label: "South West Arrow", code: "\\swarrow" },
    ],
  },
  {
    title: "Set Theory",
    helper: "Set relations and number sets",
    items: [
      { symbol: "\u2208", label: "Element Of", code: "\\in" },
      { symbol: "\u2209", label: "Not Element Of", code: "\\notin" },
      { symbol: "\u220b", label: "Contains As Member", code: "\\ni" },
      { symbol: "\u2205", label: "Empty Set", code: "\\emptyset" },
      { symbol: "\u222a", label: "Union", code: "\\cup" },
      { symbol: "\u2229", label: "Intersection", code: "\\cap" },
      { symbol: "\u2282", label: "Subset", code: "\\subset" },
      { symbol: "\u2286", label: "Subset or Equal", code: "\\subseteq" },
      { symbol: "\u2284", label: "Not Subset", code: "\\nsubseteq" },
      { symbol: "\u2283", label: "Superset", code: "\\supset" },
      { symbol: "\u2287", label: "Superset or Equal", code: "\\supseteq" },
      { symbol: "\u2216", label: "Set Minus", code: "\\setminus" },
      { symbol: "\u2115", label: "Natural Numbers", code: "\\mathbb{N}" },
      { symbol: "\u2124", label: "Integers", code: "\\mathbb{Z}" },
      { symbol: "\u211a", label: "Rational Numbers", code: "\\mathbb{Q}" },
      { symbol: "\u211d", label: "Real Numbers", code: "\\mathbb{R}" },
      { symbol: "\u2102", label: "Complex Numbers", code: "\\mathbb{C}" },
      { symbol: "\u2119", label: "Prime Set", code: "\\mathbb{P}" },
    ],
  },
  {
    title: "Logic and Proof",
    helper: "Proof writing symbols",
    items: [
      { symbol: "\u2200", label: "For All", code: "\\forall" },
      { symbol: "\u2203", label: "There Exists", code: "\\exists" },
      { symbol: "\u2204", label: "There Does Not Exist", code: "\\nexists" },
      { symbol: "\u00ac", label: "Negation", code: "\\neg" },
      { symbol: "\u2227", label: "Logical And", code: "\\land" },
      { symbol: "\u2228", label: "Logical Or", code: "\\lor" },
      { symbol: "\u22bb", label: "Xor", code: "\\veebar" },
      { symbol: "\u22a2", label: "Turnstile", code: "\\vdash" },
      { symbol: "\u22a8", label: "Models", code: "\\models" },
      { symbol: "\u22a4", label: "Top", code: "\\top" },
      { symbol: "\u22a5", label: "Bottom", code: "\\bot" },
      { symbol: "\u2234", label: "Therefore", code: "\\therefore" },
      { symbol: "\u2235", label: "Because", code: "\\because" },
    ],
  },
  {
    title: "Calculus and Analysis",
    helper: "Differentiation, integration, limits",
    items: [
      { symbol: "\u222b", label: "Integral", code: "\\int" },
      { symbol: "\u222c", label: "Double Integral", code: "\\iint" },
      { symbol: "\u222d", label: "Triple Integral", code: "\\iiint" },
      { symbol: "\u222e", label: "Contour Integral", code: "\\oint" },
      { symbol: "\u2211", label: "Summation", code: "\\sum" },
      { symbol: "\u220f", label: "Product", code: "\\prod" },
      { symbol: "\u2210", label: "Coproduct", code: "\\coprod" },
      { symbol: "\u2202", label: "Partial Derivative", code: "\\partial" },
      { symbol: "\u2207", label: "Nabla", code: "\\nabla" },
      { symbol: "\u0394", label: "Delta Change", code: "\\Delta" },
      { symbol: "\u221e", label: "Infinity", code: "\\infty" },
      { symbol: "\u2032", label: "Prime", code: "\\prime" },
      { symbol: "\u2033", label: "Double Prime", code: "\\prime\\prime" },
      { symbol: "\u2207\u00b7", label: "Divergence", code: "\\nabla\\cdot" },
      { symbol: "\u2207\u00d7", label: "Curl", code: "\\nabla\\times" },
      { symbol: "lim", label: "Limit", code: "\\lim_{x\\to a}" },
    ],
  },
  {
    title: "Geometry and Trigonometry",
    helper: "Shapes, angles, and trig shortcuts",
    items: [
      { symbol: "\u2220", label: "Angle", code: "\\angle" },
      { symbol: "\u2221", label: "Measured Angle", code: "\\measuredangle" },
      { symbol: "\u2222", label: "Spherical Angle", code: "\\sphericalangle" },
      { symbol: "\u25b3", label: "Triangle", code: "\\triangle" },
      { symbol: "\u25a1", label: "Square", code: "\\square" },
      { symbol: "\u00b0", label: "Degree", code: "^\\circ" },
      { symbol: "\u22a5", label: "Perpendicular", code: "\\perp" },
      { symbol: "\u2225", label: "Parallel", code: "\\parallel" },
      { symbol: "sin", label: "Sine", code: "\\sin" },
      { symbol: "cos", label: "Cosine", code: "\\cos" },
      { symbol: "tan", label: "Tangent", code: "\\tan" },
    ],
  },
  {
    title: "Brackets and Delimiters",
    helper: "Grouping and absolute value",
    items: [
      { symbol: "()", label: "Parentheses", code: "\\left( x \\right)" },
      { symbol: "[]", label: "Square Brackets", code: "\\left[ x \\right]" },
      { symbol: "{}", label: "Curly Braces", code: "\\left\\{ x \\right\\}" },
      { symbol: "||", label: "Absolute Value", code: "\\left| x \\right|" },
      { symbol: "\u2016", label: "Norm", code: "\\left\\| x \\right\\|" },
      { symbol: "\u230a", label: "Floor Left", code: "\\lfloor" },
      { symbol: "\u230b", label: "Floor Right", code: "\\rfloor" },
      { symbol: "\u2308", label: "Ceil Left", code: "\\lceil" },
      { symbol: "\u2309", label: "Ceil Right", code: "\\rceil" },
      { symbol: "\u27e8", label: "Angle Bracket Left", code: "\\langle" },
      { symbol: "\u27e9", label: "Angle Bracket Right", code: "\\rangle" },
    ],
  },
  {
    title: "Greek Lowercase",
    helper: "Frequently used lowercase Greek letters",
    items: [
      { symbol: "\u03b1", label: "Alpha", code: "\\alpha" },
      { symbol: "\u03b2", label: "Beta", code: "\\beta" },
      { symbol: "\u03b3", label: "Gamma", code: "\\gamma" },
      { symbol: "\u03b4", label: "Delta", code: "\\delta" },
      { symbol: "\u03b5", label: "Epsilon", code: "\\epsilon" },
      { symbol: "\u03f5", label: "Var Epsilon", code: "\\varepsilon" },
      { symbol: "\u03b6", label: "Zeta", code: "\\zeta" },
      { symbol: "\u03b7", label: "Eta", code: "\\eta" },
      { symbol: "\u03b8", label: "Theta", code: "\\theta" },
      { symbol: "\u03d1", label: "Var Theta", code: "\\vartheta" },
      { symbol: "\u03b9", label: "Iota", code: "\\iota" },
      { symbol: "\u03ba", label: "Kappa", code: "\\kappa" },
      { symbol: "\u03bb", label: "Lambda", code: "\\lambda" },
      { symbol: "\u03bc", label: "Mu", code: "\\mu" },
      { symbol: "\u03bd", label: "Nu", code: "\\nu" },
      { symbol: "\u03be", label: "Xi", code: "\\xi" },
      { symbol: "\u03bf", label: "Omicron", code: "o" },
      { symbol: "\u03c0", label: "Pi", code: "\\pi" },
      { symbol: "\u03d6", label: "Var Pi", code: "\\varpi" },
      { symbol: "\u03c1", label: "Rho", code: "\\rho" },
      { symbol: "\u03f1", label: "Var Rho", code: "\\varrho" },
      { symbol: "\u03c3", label: "Sigma", code: "\\sigma" },
      { symbol: "\u03c2", label: "Var Sigma", code: "\\varsigma" },
      { symbol: "\u03c4", label: "Tau", code: "\\tau" },
      { symbol: "\u03c5", label: "Upsilon", code: "\\upsilon" },
      { symbol: "\u03c6", label: "Phi", code: "\\phi" },
      { symbol: "\u03d5", label: "Var Phi", code: "\\varphi" },
      { symbol: "\u03c7", label: "Chi", code: "\\chi" },
      { symbol: "\u03c8", label: "Psi", code: "\\psi" },
      { symbol: "\u03c9", label: "Omega", code: "\\omega" },
    ],
  },
  {
    title: "Greek Uppercase",
    helper: "Common uppercase Greek letters",
    items: [
      { symbol: "\u0393", label: "Gamma", code: "\\Gamma" },
      { symbol: "\u0394", label: "Delta", code: "\\Delta" },
      { symbol: "\u0398", label: "Theta", code: "\\Theta" },
      { symbol: "\u039b", label: "Lambda", code: "\\Lambda" },
      { symbol: "\u039e", label: "Xi", code: "\\Xi" },
      { symbol: "\u03a0", label: "Pi", code: "\\Pi" },
      { symbol: "\u03a3", label: "Sigma", code: "\\Sigma" },
      { symbol: "\u03a5", label: "Upsilon", code: "\\Upsilon" },
      { symbol: "\u03a6", label: "Phi", code: "\\Phi" },
      { symbol: "\u03a8", label: "Psi", code: "\\Psi" },
      { symbol: "\u03a9", label: "Omega", code: "\\Omega" },
    ],
  },
  {
    title: "Accents and Format Helpers",
    helper: "Decorators and text-style symbols",
    items: [
      { symbol: "x^", label: "Hat", code: "\\hat{x}" },
      { symbol: "x~", label: "Tilde", code: "\\tilde{x}" },
      { symbol: "x-", label: "Bar", code: "\\bar{x}" },
      { symbol: "v>", label: "Vector Arrow", code: "\\vec{v}" },
      { symbol: "x.", label: "Dot", code: "\\dot{x}" },
      { symbol: "x..", label: "Double Dot", code: "\\ddot{x}" },
      { symbol: "AB-", label: "Overline", code: "\\overline{AB}" },
      { symbol: "AB_", label: "Underline", code: "\\underline{AB}" },
      { symbol: "[x]", label: "Boxed", code: "\\boxed{x}" },
      { symbol: "a/b", label: "Fraction", code: "\\frac{a}{b}" },
      { symbol: "nCr", label: "Binomial", code: "\\binom{n}{r}" },
    ],
  },
  {
    title: "Number Theory and Misc",
    helper: "Special symbols used in advanced math",
    items: [
      { symbol: "\u2135", label: "Aleph", code: "\\aleph" },
      { symbol: "\u2136", label: "Beth", code: "\\beth" },
      { symbol: "\u2137", label: "Gimel", code: "\\gimel" },
      { symbol: "\u2138", label: "Daleth", code: "\\daleth" },
      { symbol: "\u210f", label: "h-bar", code: "\\hbar" },
      { symbol: "\u2113", label: "Script l", code: "\\ell" },
      { symbol: "\u2118", label: "Weierstrass p", code: "\\wp" },
      { symbol: "\u211c", label: "Real Part", code: "\\Re" },
      { symbol: "\u2111", label: "Imaginary Part", code: "\\Im" },
      { symbol: "\u2127", label: "Mho", code: "\\mho" },
      { symbol: "\u2020", label: "Dagger", code: "\\dagger" },
      { symbol: "\u2021", label: "Double Dagger", code: "\\ddagger" },
      { symbol: "\u2026", label: "Ellipsis", code: "\\cdots" },
      { symbol: "\u22ee", label: "Vertical Dots", code: "\\vdots" },
      { symbol: "\u22f1", label: "Diagonal Dots", code: "\\ddots" },
      { symbol: "\u22ef", label: "Center Dots", code: "\\cdots" },
    ],
  },
];

const TOTAL_SYMBOLS = SYMBOL_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
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

const SymbolGroupList = ({ title, helper, items, onUse }) => (
  <Paper
    sx={{
      borderRadius: 2.5,
      border: "1px solid",
      borderColor: "#e2e8f0",
      minHeight: "fit-content",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
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

    <Box sx={{ p: { xs: 0.8, md: 1 } }}>
      <Stack spacing={0.9}>
        {items.map((item) => (
          <Paper
            key={`${title}-${item.code}`}
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
                {item.symbol} {item.label}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => onUse(item.code)}
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
              {item.code}
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  </Paper>
);

const SymbolsDrawer = ({ open, onClose, onUse }) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    transitionDuration={{ enter: 0, exit: 0 }}
    ModalProps={{ keepMounted: true }}
    PaperProps={{
      sx: {
        width: { xs: "100%", sm: 430, md: 470 },
        maxWidth: "100vw",
        bgcolor: "#f8fafc",
      },
    }}
  >
    <Box sx={{ p: { xs: 1.1, md: 1.4 }, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.8 }}>
        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.02rem", md: "1.12rem" } }}>
            Symbol Sidebar
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: "0.76rem", md: "0.84rem" } }}>
            {TOTAL_SYMBOLS} symbols grouped by type with LaTeX code
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", borderRadius: 999, fontWeight: 700 }}
        >
          Close
        </Button>
      </Stack>

      <Stack spacing={0.9} sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.1, alignItems: "stretch" }}>
        {SYMBOL_GROUPS.map((group) => (
          <SymbolGroupList
            key={group.title}
            title={group.title}
            helper={`${group.helper} - ${group.items.length} symbols`}
            items={group.items}
            onUse={onUse}
          />
        ))}
      </Stack>
    </Box>
  </Drawer>
);

export default function MathGuide() {
  const [liveInput, setLiveInput] = useState(DEFAULT_SNIPPET);
  const [isSymbolsOpen, setIsSymbolsOpen] = useState(false);

  const appendSymbolToEditor = (code = "") => {
    const symbolCode = String(code || "").trim();
    if (!symbolCode) return;
    setLiveInput((prev) => (String(prev || "").trim() ? `${prev} ${symbolCode}` : symbolCode));
  };

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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={0.8}
            >
              <Box>
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
              </Box>

              <Button
                variant="outlined"
                startIcon={<Category />}
                onClick={() => setIsSymbolsOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 999,
                  px: 1.3,
                  fontSize: { xs: "0.74rem", md: "0.8rem" },
                  borderColor: "#bfdbfe",
                  color: "#1d4ed8",
                  bgcolor: "rgba(239,246,255,0.9)",
                  whiteSpace: "nowrap",
                }}
              >
                Symbols
              </Button>
            </Stack>

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

      <SymbolsDrawer
        open={isSymbolsOpen}
        onClose={() => setIsSymbolsOpen(false)}
        onUse={appendSymbolToEditor}
      />
    </Box>
  );
}


