import { Box } from "@mui/material";
import "react-quill-new/dist/quill.snow.css";

interface RichTextDisplayProps {
  content: string;
  maxHeight?: number | string;
  className?: string;
}

export const RichTextDisplay = ({
  content,
  maxHeight,
  className,
}: RichTextDisplayProps) => {
  if (!content) {
    return null;
  }

  return (
    <Box
      className={`ql-snow ${className || ""}`}
      sx={{
        "& .ql-editor": {
          padding: 0,
          overflow: "auto",
          maxHeight: maxHeight,
          
          // Typography styles
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            marginTop: "0.5em",
            marginBottom: "0.5em",
          },
          "& p": {
            marginBottom: "0.5em",
          },
          "& ul, & ol": {
            paddingLeft: "1.5em",
            marginBottom: "0.5em",
          },
          "& blockquote": {
            borderLeft: "4px solid #ccc",
            marginLeft: 0,
            paddingLeft: "1em",
            color: "#666",
            fontStyle: "italic",
          },
          "& pre.ql-syntax": {
            backgroundColor: "#23241f",
            color: "#f8f8f2",
            padding: "0.5em 1em",
            borderRadius: "4px",
            overflow: "auto",
          },
          "& a": {
            color: "#1976d2",
            textDecoration: "underline",
          },
          "& img": {
            maxWidth: "100%",
            height: "auto",
          },
          "& .ql-align-center": {
            textAlign: "center",
          },
          "& .ql-align-right": {
            textAlign: "right",
          },
          "& .ql-align-justify": {
            textAlign: "justify",
          },
        },
      }}
    >
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Box>
  );
};

