import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { NotificationWithUser } from "../types/notification.types";
import { useGetAllUsers } from "../../users/queries/user.queries";
import { RichTextEditor } from "@/components/RichTextEditor";

interface NotificationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; sendTo: string }) => void;
  initialData?: NotificationWithUser | null;
  isLoading?: boolean;
}

export const NotificationFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: NotificationFormDialogProps) => {
  const { data: users } = useGetAllUsers();

  const availableUsers = Array.isArray(users) ? users : [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string; content: string; sendTo: string }>({
    defaultValues: {
      title: "",
      content: "",
      sendTo: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        content: initialData.content || "",
        sendTo: initialData.sendTo || "",
      });
    } else {
      reset({
        title: "",
        content: "",
        sendTo: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: { title: string; content: string; sendTo: string }) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật thông báo" : "Tạo thông báo mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Controller
              name="sendTo"
              control={control}
              rules={{ required: "Người nhận là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.sendTo}>
                  <InputLabel>Người nhận</InputLabel>
                  <Select {...field} label="Người nhận" disabled={!!initialData}>
                    {availableUsers.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.sendTo?.message || (initialData ? "Không thể thay đổi người nhận" : "Chọn người dùng để gửi thông báo")}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="title"
              control={control}
              rules={{ required: "Tiêu đề là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tiêu đề"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Nhập tiêu đề thông báo"
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: "Nội dung là bắt buộc" }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  label="Nội dung"
                  placeholder="Nhập nội dung thông báo..."
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  minHeight={200}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading || !!initialData}>
            {isLoading
              ? "Đang xử lý..."
              : initialData
              ? "Cập nhật (Không hỗ trợ)"
              : "Tạo thông báo"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
