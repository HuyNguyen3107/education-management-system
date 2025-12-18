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
import type {
  CreateAspirationRegisterRequest,
  AspirationRegister,
} from "../types/aspiration-register.types";
import { useStudents } from "../../students/queries/student.queries";
import { useSubjects } from "../../subjects/queries/subject.queries";
import { RichTextEditor } from "@/components/RichTextEditor";

interface AspirationRegisterFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAspirationRegisterRequest) => void;
  initialData?: AspirationRegister | null;
  isLoading?: boolean;
}

export const AspirationRegisterFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: AspirationRegisterFormDialogProps) => {
  const { data: students = [] } = useStudents();
  const { data: subjects = [] } = useSubjects();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAspirationRegisterRequest>({
    defaultValues: {
      studentId: "",
      subjectCode: "",
      semester: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        subjectCode: initialData.subjectCode,
        semester: initialData.semester,
        reason: initialData.reason || "",
      });
    } else {
      reset({
        studentId: "",
        subjectCode: "",
        semester: "",
        reason: "",
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: CreateAspirationRegisterRequest) => {
    const cleanData: CreateAspirationRegisterRequest = {
      studentId: data.studentId,
      subjectCode: data.subjectCode,
      semester: data.semester,
      reason: data.reason ?? "",
    };
    onSubmit(cleanData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật nguyện vọng đăng ký"
          : "Thêm mới nguyện vọng đăng ký"}
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
              name="subjectCode"
              control={control}
              rules={{ required: "Môn học là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.subjectCode}>
                  <InputLabel>Môn học</InputLabel>
                  <Select {...field} label="Môn học">
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.subjectCode}>
                        {subject.subjectCode} - {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.subjectCode?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="semester"
              control={control}
              rules={{ required: "Học kỳ là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Học kỳ"
                  fullWidth
                  error={!!errors.semester}
                  helperText={errors.semester?.message}
                  placeholder="Nhập học kỳ (Ví dụ: HK1 2024-2025)"
                />
              )}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  label="Lý do"
                  placeholder="Nhập lý do đăng ký nguyện vọng (không bắt buộc)..."
                  minHeight={150}
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
