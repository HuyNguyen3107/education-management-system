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
  const validateYearFormat = (year: string) => {
    // Validate year format (YYYY)
    const yearRegex = /^\d{4}$/;
    if (!year) return "Năm học là bắt buộc";
    if (!yearRegex.test(year)) {
      return "Năm học phải có định dạng YYYY (ví dụ: 2025)";
    }
    const yearNum = parseInt(year);
    const currentYear = new Date().getFullYear();
    if (yearNum < 2000 || yearNum > currentYear + 1) {
      return `Năm học phải từ 2000 đến ${currentYear + 1}`;
    }
    return true;
  };

  const validateAcademicYearFormat = (academicYear: string) => {
    // Validate academic year format (YYYY-YYYY)
    const academicYearRegex = /^\d{4}-\d{4}$/;
    if (!academicYear) return "Niên khóa là bắt buộc";
    if (!academicYearRegex.test(academicYear)) {
      return "Niên khóa phải có định dạng YYYY-YYYY (ví dụ: 2021-2026)";
    }
    const [startYear, endYear] = academicYear.split("-").map(Number);
    const currentYear = new Date().getFullYear();
    if (startYear < 2000 || endYear > currentYear + 10) {
      return "Niên khóa không hợp lệ";
    }
    if (endYear - startYear < 3 || endYear - startYear > 6) {
      return "Niên khóa phải từ 3-6 năm (ví dụ: 2021-2026)";
    }
    return true;
  };

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
    mode: "onBlur", // Validate on blur for better UX
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
              rules={{
                required: "Năm học là bắt buộc",
                validate: validateYearFormat,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Năm học"
                  fullWidth
                  error={!!errors.year}
                  helperText={
                    errors.year?.message || "Định dạng: YYYY (ví dụ: 2025)"
                  }
                  placeholder="VD: 2025"
                />
              )}
            />

            <Controller
              name="academicYear"
              control={control}
              rules={{
                required: "Niên khóa là bắt buộc",
                validate: validateAcademicYearFormat,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Niên khóa"
                  fullWidth
                  error={!!errors.academicYear}
                  helperText={
                    errors.academicYear?.message ||
                    "Định dạng: YYYY-YYYY (ví dụ: 2021-2026)"
                  }
                  placeholder="VD: 2021-2026"
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              rules={{
                required: "Học phí là bắt buộc",
                min: {
                  value: 10000,
                  message: "Học phí mỗi tín chỉ phải ít nhất 10,000 VND",
                },
                max: {
                  value: 5000000,
                  message: "Học phí mỗi tín chỉ không được quá 5,000,000 VND",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Học phí mỗi tín chỉ (VND)"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={
                    errors.price?.message ||
                    "Học phí sẽ được tính: Tổng số tín chỉ × Học phí mỗi tín chỉ"
                  }
                  InputProps={{
                    inputProps: { min: 10000, max: 5000000, step: 1000 },
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
