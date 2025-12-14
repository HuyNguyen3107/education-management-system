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
import type { CreateClassRequest, Class } from "../types/class.types";
import { useLecturers } from "../../lecturers/queries/lecturer.queries";
import { useMajors } from "../../majors/queries/major.queries";
import { useSpecializations } from "../../specializations/queries/specialization.queries";

interface ClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassRequest) => void;
  initialData?: Class | null;
  isLoading?: boolean;
}

export const ClassFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ClassFormDialogProps) => {
  const { data: lecturers = [] } = useLecturers();
  const { data: majorsData } = useMajors({ size: 1000 });
  const majors = majorsData?.content || [];
  const { data: specializationsData } = useSpecializations({ size: 1000 });
  const specializations = specializationsData?.content || [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateClassRequest>({
    defaultValues: {
      classCode: "",
      teacherId: "",
      majorId: "",
      specializationId: "",
    },
  });

  const selectedMajorId = watch("majorId");

  // Filter specializations by selected major
  const filteredSpecializations = selectedMajorId
    ? specializations.filter((s) => s.majorId === selectedMajorId)
    : specializations;

  useEffect(() => {
    if (initialData) {
      reset({
        classCode: initialData.classCode,
        teacherId: initialData.teacherId,
        majorId: initialData.majorId || "",
        specializationId: initialData.specializationId || "",
      });
    } else {
      reset({
        classCode: "",
        teacherId: "",
        majorId: "",
        specializationId: "",
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: CreateClassRequest) => {
    // Clean up empty optional fields
    const cleanData: CreateClassRequest = {
      classCode: data.classCode,
      teacherId: data.teacherId,
      ...(data.majorId && { majorId: data.majorId }),
      ...(data.specializationId && { specializationId: data.specializationId }),
    };
    onSubmit(cleanData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật lớp học" : "Thêm mới lớp học"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="classCode"
              control={control}
              rules={{ required: "Mã lớp là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã lớp"
                  fullWidth
                  error={!!errors.classCode}
                  helperText={errors.classCode?.message}
                  placeholder="Nhập mã lớp học (Ví dụ: CNTT-K20-01)"
                />
              )}
            />

            <Controller
              name="teacherId"
              control={control}
              rules={{ required: "Giảng viên phụ trách là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.teacherId}>
                  <InputLabel>Giảng viên phụ trách</InputLabel>
                  <Select {...field} label="Giảng viên phụ trách">
                    {lecturers.map((lecturer) => (
                      <MenuItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.teacherCode}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.teacherId?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="majorId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Ngành học</InputLabel>
                  <Select {...field} label="Ngành học">
                    <MenuItem value="">
                      <em>Không chọn</em>
                    </MenuItem>
                    {majors.map((major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="specializationId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Chuyên ngành</InputLabel>
                  <Select {...field} label="Chuyên ngành">
                    <MenuItem value="">
                      <em>Không chọn</em>
                    </MenuItem>
                    {filteredSpecializations.map((spec) => (
                      <MenuItem key={spec.id} value={spec.id}>
                        {spec.name}
                      </MenuItem>
                    ))}
                  </Select>
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
