import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { Tuition } from "../types/tuition.types";

interface TuitionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    price: number;
    semester: string;
    year: string;
    academicYear: string;
  }) => void;
  initialData?: Tuition | null;
  isLoading?: boolean;
}

const SEMESTER_OPTIONS = [
  { value: "Học kỳ 1", label: "Học kỳ 1" },
  { value: "Học kỳ 2", label: "Học kỳ 2" },
  { value: "Học kỳ 3", label: "Học kỳ 3" },
  { value: "Học kỳ hè", label: "Học kỳ hè" },
];

export const TuitionFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TuitionFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    price: number;
    semester: string;
    year: string;
    academicYear: string;
  }>({
    defaultValues: {
      price: 0,
      semester: "",
      year: "",
      academicYear: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        price: initialData.price || 0,
        semester: initialData.semester || "",
        year: initialData.year || "",
        academicYear: initialData.academicYear || "",
      });
    } else {
      reset({
        price: 0,
        semester: "",
        year: new Date().getFullYear().toString(),
        academicYear: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: {
    price: number;
    semester: string;
    year: string;
    academicYear: string;
  }) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật học phí" : "Thêm mới học phí"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="semester"
              control={control}
              rules={{ required: "Học kỳ là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.semester}>
                  <InputLabel>Học kỳ</InputLabel>
                  <Select {...field} label="Học kỳ">
                    {SEMESTER_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.semester?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="year"
              control={control}
              rules={{ required: "Năm học là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Năm học"
                  fullWidth
                  error={!!errors.year}
                  helperText={errors.year?.message}
                  placeholder="VD: 2024-2025"
                />
              )}
            />

            <Controller
              name="academicYear"
              control={control}
              rules={{ required: "Niên khóa là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Niên khóa"
                  fullWidth
                  error={!!errors.academicYear}
                  helperText={errors.academicYear?.message}
                  placeholder="VD: K2024"
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              rules={{
                required: "Học phí là bắt buộc",
                min: { value: 0, message: "Học phí phải lớn hơn 0" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Học phí (VND)"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputProps={{
                    inputProps: { min: 0, step: 1000 },
                  }}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading
              ? "Đang xử lý..."
              : initialData
              ? "Cập nhật"
              : "Thêm mới"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

