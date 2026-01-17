import React, { lazy, Suspense, memo, useMemo } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

// Lazy load MathJax components with retry mechanism
const loadMathJax = () => import('better-react-mathjax')
  .catch(() => new Promise(resolve => {
    // Retry after 1 second if first attempt fails
    setTimeout(() => resolve(import('better-react-mathjax')), 1000);
  }));

const MathJax = lazy(() => loadMathJax().then(module => ({ default: module.MathJax })));
const MathJaxContext = lazy(() => loadMathJax().then(module => ({ default: module.MathJaxContext })));

// MathJax configuration (memoized to prevent unnecessary re-renders)
const mathJaxConfig = {
  tex: {
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    displayMath: [['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
    enableExplorer: false,
    enableAssistiveMml: false,
    skipHtmlTags: {
      '[-]': ['script', 'style', 'textarea', 'pre', 'code']
    }
  },
  loader: {
    load: ['[tex]/html']
  }
};

const RenderHTML = ({ content, sx = {}, ...props }) => {
  // Safely convert content to string
  const htmlContent = useMemo(() => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'object') return JSON.stringify(content);
    return String(content);
  }, [content]);

  // Parser options with memoization
  const parserOptions = useMemo(() => ({
    replace: (domNode) => {
      if (domNode.name === 'a' && domNode.attribs?.href) {
        return (
          <a
            href={domNode.attribs.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            {domToReact(domNode.children, parserOptions)}
          </a>
        );
      }
      
      // Handle other special cases if needed
      return domNode;
    }
  }), []);

  // Return null for empty content
  if (!htmlContent.trim()) {
    return null;
  }

  return (
    <Suspense fallback={<Box component="span" sx={sx} {...props} />}>
      <MathJaxContext config={mathJaxConfig}>
        <Box
          component="span"
          sx={{
            display: 'inline',
            fontStyle: 'normal',
            fontSize: '1.25rem',
            '& sup': { 
              verticalAlign: 'super', 
              fontSize: '0.8em',
              lineHeight: 0
            },
            '& sub': { 
              verticalAlign: 'sub', 
              fontSize: '0.8em',
              lineHeight: 0
            },
            '& .MathJax': { 
              display: 'inline !important', 
              '& svg': { display: 'inline' }
            },
            ...sx,
          }}
          {...props}
        >
          <MathJax dynamic>
            {parse(htmlContent, parserOptions)}
          </MathJax>
        </Box>
      </MathJaxContext>
    </Suspense>
  );
};

RenderHTML.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),
  sx: PropTypes.object
};

RenderHTML.defaultProps = {
  content: '',
  sx: {}
};

export default memo(RenderHTML);