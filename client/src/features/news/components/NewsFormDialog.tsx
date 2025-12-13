import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { CreateNewsRequest, News } from "../types/news.types";
import { RichTextEditor } from "@/components/RichTextEditor";

interface NewsFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNewsRequest) => void;
  initialData?: News | null;
  isLoading?: boolean;
}

export const NewsFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: NewsFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNewsRequest>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        content: initialData.content || "",
      });
    } else {
      reset({
        title: "",
        content: "",
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: CreateNewsRequest) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật tin tức" : "Thêm mới tin tức"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Vui lòng nhập tiêu đề" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tiêu đề"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Nhập tiêu đề tin tức"
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: "Vui lòng nhập nội dung" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  label="Nội dung"
                  placeholder="Nhập nội dung tin tức..."
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  minHeight={250}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Lưu"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
