import React, { memo, useMemo } from "react";
import parse from "html-react-parser";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { processData } from "./processData";

const RenderHTML = ({ content, sx = {}, ...props }) => {
  const sourceContent = useMemo(() => {
    if (content == null) return "";
    if (typeof content === "string") return content;
    if (typeof content === "object") return JSON.stringify(content);
    return String(content);
  }, [content]);

  const processedContent = useMemo(() => processData(sourceContent), [sourceContent]);

  if (!String(processedContent || "").trim()) {
    return null;
  }

  return (
    <Box
      component="div"
      sx={{
        fontStyle: "normal",
        fontSize: "1.125rem",
        lineHeight: 1.8,
        "& .katex-display": {
          margin: "0.4rem 0",
          overflowX: "auto",
          overflowY: "hidden",
        },
        "& .katex": {
          fontSize: "1.05em",
        },
        "& .fp-inline-question-image": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: 1,
          marginBottom: "0.5rem",
        },
        ...sx,
      }}
      {...props}
    >
      {parse(processedContent)}
    </Box>
  );
};

RenderHTML.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  sx: PropTypes.object,
};

RenderHTML.defaultProps = {
  content: "",
  sx: {},
};

export default memo(RenderHTML);
