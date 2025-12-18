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
  Typography,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import type {
  CreateStudentTuitionRequest,
  StudentTuition,
} from "../types/student-tuition.types";
import { useStudents } from "../../students/queries/student.queries";
import { useTuitions } from "../../tuitions/queries/tuition.queries";

interface StudentTuitionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentTuitionRequest) => void;
  initialData?: StudentTuition | null;
  isLoading?: boolean;
}

export const StudentTuitionFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: StudentTuitionFormDialogProps) => {
  const { data: students = [] } = useStudents();
  const { data: tuitions = [] } = useTuitions();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStudentTuitionRequest>({
    defaultValues: {
      studentId: "",
      tuitionId: "",
      endow: 0,
    },
  });

  const selectedTuitionId = watch("tuitionId");
  const endow = watch("endow");

  const selectedTuition = useMemo(() => {
    return tuitions.find((t) => t.id === selectedTuitionId);
  }, [tuitions, selectedTuitionId]);

  const finalAmount = useMemo(() => {
    if (!selectedTuition) return 0;
    return selectedTuition.price - (endow || 0);
  }, [selectedTuition, endow]);

  useEffect(() => {
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        tuitionId: initialData.tuitionId,
        endow: initialData.endow || 0,
      });
    } else {
      reset({
        studentId: "",
        tuitionId: "",
        endow: 0,
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: CreateStudentTuitionRequest) => {
    const cleanData: CreateStudentTuitionRequest = {
      studentId: data.studentId,
      tuitionId: data.tuitionId,
      endow: data.endow || 0,
    };
    onSubmit(cleanData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật học phí sinh viên"
          : "Thêm mới học phí sinh viên"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="studentId"
              control={control}
              rules={{ required: "Sinh viên là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.studentId}>
                  <InputLabel>Sinh viên</InputLabel>
                  <Select {...field} label="Sinh viên">
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.studentCode}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.studentId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="tuitionId"
              control={control}
              rules={{ required: "Học phí là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.tuitionId}>
                  <InputLabel>Học phí</InputLabel>
                  <Select {...field} label="Học phí">
                    {tuitions.map((tuition) => (
                      <MenuItem key={tuition.id} value={tuition.id}>
                        {tuition.semester} {tuition.year} -{" "}
                        {tuition.price.toLocaleString("vi-VN")} VNĐ
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.tuitionId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="endow"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Ưu đãi / Miễn giảm"
                  fullWidth
                  placeholder="Nhập số tiền được ưu đãi hoặc miễn giảm"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">VNĐ</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              )}
            />

            {selectedTuition && (
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Học phí gốc: {selectedTuition.price.toLocaleString("vi-VN")}{" "}
                  VNĐ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ưu đãi: {(endow || 0).toLocaleString("vi-VN")} VNĐ
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ mt: 1 }}
                >
                  Thành tiền: {finalAmount.toLocaleString("vi-VN")} VNĐ
                </Typography>
              </Box>
            )}
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
