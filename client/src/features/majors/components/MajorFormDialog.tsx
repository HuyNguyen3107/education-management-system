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
import type { CreateMajorRequest, Major } from "../types/major.types";

interface MajorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMajorRequest) => void;
  initialData?: Major | null;
  isLoading?: boolean;
}

export const MajorFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: MajorFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMajorRequest>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
      });
    } else {
      reset({
        name: "",
      });
    }
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật ngành học" : "Thêm mới ngành học"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên ngành là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên ngành"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
