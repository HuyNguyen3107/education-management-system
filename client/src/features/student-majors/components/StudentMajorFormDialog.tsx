import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  CreateStudentMajorRequest,
  StudentMajor,
} from "../types/student-major.types";
import { useStudents } from "../../students/queries/student.queries";
import { useQuery } from "@tanstack/react-query";
import { majorService } from "../../majors/services/major.services";
import { specializationService } from "../../specializations/services/specialization.services";
import type { Major } from "../../majors/types/major.types";
import type { Specialization } from "../../specializations/types/specialization.types";

interface StudentMajorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentMajorRequest) => void;
  initialData?: StudentMajor | null;
  isLoading?: boolean;
}

export const StudentMajorFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: StudentMajorFormDialogProps) => {
  const { data: students = [] } = useStudents();
  const { data: majors = [] } = useQuery({
    queryKey: ["majors", "all"],
    queryFn: () => majorService.getAllMajors(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateStudentMajorRequest>({
    defaultValues: {
      studentId: "",
      majorId: "",
      specializationId: null,
    },
  });

  const selectedMajorId = watch("majorId");

  const { data: specializations = [] } = useQuery<Specialization[]>({
    queryKey: ["specializations", "major", selectedMajorId],
    queryFn: () =>
      specializationService.getSpecializationsByMajorId(selectedMajorId),
    enabled: !!selectedMajorId,
  });

  useEffect(() => {
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        majorId: initialData.majorId,
        specializationId: initialData.specializationId || null,
      });
    } else {
      reset({
        studentId: "",
        majorId: "",
        specializationId: null,
      });
    }
  }, [initialData, reset, open]);

  // Reset specialization when major changes
  useEffect(() => {
    if (open && selectedMajorId && !initialData) {
      setValue("specializationId", null);
    }
  }, [selectedMajorId, open, setValue, initialData]);

  const handleFormSubmit = (data: CreateStudentMajorRequest) => {
    const cleanData: CreateStudentMajorRequest = {
      studentId: data.studentId,
      majorId: data.majorId,
      specializationId: data.specializationId || null,
    };
    onSubmit(cleanData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật ngành/chuyên ngành sinh viên"
          : "Gán ngành/chuyên ngành cho sinh viên"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <Controller
              name="studentId"
              control={control}
              rules={{ required: "Sinh viên là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.studentId}>
                  <InputLabel>Sinh viên</InputLabel>
                  <Select {...field} label="Sinh viên" disabled={!!initialData}>
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
              name="majorId"
              control={control}
              rules={{ required: "Ngành là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.majorId}>
                  <InputLabel>Ngành</InputLabel>
                  <Select {...field} label="Ngành">
                    {majors.map((major: Major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.majorId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="specializationId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.specializationId}>
                  <InputLabel>Chuyên ngành (tùy chọn)</InputLabel>
                  <Select
                    {...field}
                    label="Chuyên ngành (tùy chọn)"
                    value={field.value || ""}
                    disabled={!selectedMajorId}
                  >
                    <MenuItem value="">
                      <em>Không chọn</em>
                    </MenuItem>
                    {specializations.map((specialization) => (
                      <MenuItem
                        key={specialization.id}
                        value={specialization.id}
                      >
                        {specialization.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.specializationId?.message ||
                      (!selectedMajorId &&
                        "Vui lòng chọn ngành trước khi chọn chuyên ngành")}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Gán"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
