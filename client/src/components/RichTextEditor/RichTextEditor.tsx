import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Box, Typography, FormHelperText } from "@mui/material";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  minHeight?: number;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];

export const RichTextEditor = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  minHeight = 200,
}: RichTextEditorProps) => {
  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: error ? "error.main" : "text.primary",
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          "& .quill": {
            border: error ? "1px solid" : "1px solid",
            borderColor: error ? "error.main" : "divider",
            borderRadius: 1,
            overflow: "hidden",
            "&:hover": {
              borderColor: error ? "error.main" : "text.primary",
            },
            "&:focus-within": {
              borderColor: error ? "error.main" : "primary.main",
              borderWidth: 2,
            },
          },
          "& .ql-toolbar": {
            borderBottom: "1px solid",
            borderBottomColor: "divider",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            bgcolor: "#fafafa",
          },
          "& .ql-container": {
            border: "none !important",
            minHeight: minHeight,
            fontSize: "14px",
            fontFamily: "inherit",
          },
          "& .ql-editor": {
            minHeight: minHeight,
            "&.ql-blank::before": {
              fontStyle: "normal",
              color: "#999",
            },
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Box>
      {helperText && (
        <FormHelperText error={error} sx={{ mx: "14px", mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

