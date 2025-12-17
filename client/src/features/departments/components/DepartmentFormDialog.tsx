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
  FormHelperText
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { CreateDepartmentRequest, Department } from "../types/department.types";
import { useMajors } from "../../majors/queries/major.queries";

interface DepartmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentRequest) => void;
  initialData?: Department | null;
  isLoading?: boolean;
}

export const DepartmentFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: DepartmentFormDialogProps) => {
  const { data: majorsData } = useMajors({ size: 1000 });
  const majors = majorsData?.content || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDepartmentRequest>({
    defaultValues: {
      name: "",
      majorId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        majorId: initialData.majorId,
      });
    } else {
      reset({
        name: "",
        majorId: "",
      });
    }
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật khoa" : "Thêm mới khoa"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên khoa là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên khoa"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="majorId"
              control={control}
              rules={{ required: "Ngành học là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.majorId}>
                  <InputLabel>Ngành học</InputLabel>
                  <Select
                    {...field}
                    label="Ngành học"
                  >
                    {majors.map((major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.majorId?.message}</FormHelperText>
                </FormControl>
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
