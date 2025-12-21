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
import type { TimeRegister } from "../types/time-register.types";

// Options for semester type dropdown
const SEMESTER_TYPE_OPTIONS = [
  { value: "", label: "-- Chọn loại học kỳ --" },
  { value: "SEMESTER_1", label: "Học kỳ 1" },
  { value: "SEMESTER_2", label: "Học kỳ 2" },
  { value: "SUMMER", label: "Học kỳ hè" },
];

// Options for registration type dropdown
const REGISTRATION_TYPE_OPTIONS = [
  { value: "", label: "-- Chọn loại đăng ký --" },
  { value: "subject_registration", label: "Đăng ký học phần" },
  { value: "wishlist_registration", label: "Đăng ký nguyện vọng" },
];

interface TimeRegisterFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    typeSemester?: string;
    typeRegister?: string;
    openTime: string;
    endTime: string;
  }) => void;
  initialData?: TimeRegister | null;
  isLoading?: boolean;
}

export const TimeRegisterFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TimeRegisterFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{
    typeSemester: string;
    typeRegister: string;
    openTime: string;
    endTime: string;
  }>({
    defaultValues: {
      typeSemester: "",
      typeRegister: "",
      openTime: "",
      endTime: "",
    },
  });

  const openTime = watch("openTime");

  useEffect(() => {
    if (initialData) {
      // Convert datetime string to datetime-local format
      const formatForInput = (dateTimeString: string) => {
        try {
          const date = new Date(dateTimeString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
          return "";
        }
      };

      reset({
        typeSemester: initialData.typeSemester || "",
        typeRegister: initialData.typeRegister || "",
        openTime: formatForInput(initialData.openTime),
        endTime: formatForInput(initialData.endTime),
      });
    } else {
      reset({
        typeSemester: "",
        typeRegister: "",
        openTime: "",
        endTime: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: {
    typeSemester: string;
    typeRegister: string;
    openTime: string;
    endTime: string;
  }) => {
    // Convert datetime-local to ISO string
    const formatForSubmit = (dateTimeLocal: string) => {
      if (!dateTimeLocal) return "";
      return new Date(dateTimeLocal).toISOString();
    };

    onSubmit({
      typeSemester: data.typeSemester || undefined,
      typeRegister: data.typeRegister || undefined,
      openTime: formatForSubmit(data.openTime),
      endTime: formatForSubmit(data.endTime),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật thời gian đăng ký"
          : "Thêm mới thời gian đăng ký"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="typeSemester"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="type-semester-label">Loại học kỳ</InputLabel>
                  <Select
                    {...field}
                    labelId="type-semester-label"
                    label="Loại học kỳ"
                  >
                    {SEMESTER_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Loại học kỳ (tùy chọn)</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="typeRegister"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="type-register-label">Loại đăng ký</InputLabel>
                  <Select
                    {...field}
                    labelId="type-register-label"
                    label="Loại đăng ký"
                  >
                    {REGISTRATION_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Loại đăng ký (tùy chọn)</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name="openTime"
              control={control}
              rules={{ required: "Thời gian mở là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Thời gian mở"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.openTime}
                  helperText={errors.openTime?.message}
                />
              )}
            />

            <Controller
              name="endTime"
              control={control}
              rules={{
                required: "Thời gian đóng là bắt buộc",
                validate: (value) => {
                  if (
                    openTime &&
                    value &&
                    new Date(value) <= new Date(openTime)
                  ) {
                    return "Thời gian đóng phải sau thời gian mở";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Thời gian đóng"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
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
