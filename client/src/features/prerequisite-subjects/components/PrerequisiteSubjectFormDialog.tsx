import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { PrerequisiteSubject } from "../types/prerequisite-subject.types";

interface PrerequisiteSubjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { registerCode: string; prerequisiteCode: string }) => void;
  initialData?: PrerequisiteSubject | null;
  isLoading?: boolean;
}

export const PrerequisiteSubjectFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: PrerequisiteSubjectFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{
    registerCode: string;
    prerequisiteCode: string;
  }>({
    defaultValues: {
      registerCode: "",
      prerequisiteCode: "",
    },
  });

  const registerCode = watch("registerCode");
  const prerequisiteCode = watch("prerequisiteCode");

  useEffect(() => {
    if (initialData) {
      reset({
        registerCode: initialData.registerCode || "",
        prerequisiteCode: initialData.prerequisiteCode || "",
      });
    } else {
      reset({
        registerCode: "",
        prerequisiteCode: "",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: {
    registerCode: string;
    prerequisiteCode: string;
  }) => {
    // Validate that registerCode and prerequisiteCode are different
    if (data.registerCode === data.prerequisiteCode) {
      return;
    }
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật môn học tiên quyết"
          : "Thêm mới môn học tiên quyết"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Controller
              name="registerCode"
              control={control}
              rules={{
                required: "Mã môn đăng ký là bắt buộc",
                validate: (value) => {
                  if (value === prerequisiteCode) {
                    return "Mã môn đăng ký không được trùng với mã môn tiên quyết";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã môn đăng ký"
                  fullWidth
                  error={!!errors.registerCode}
                  helperText={errors.registerCode?.message}
                  placeholder="VD: CS101"
                />
              )}
            />

            <Controller
              name="prerequisiteCode"
              control={control}
              rules={{
                required: "Mã môn tiên quyết là bắt buộc",
                validate: (value) => {
                  if (value === registerCode) {
                    return "Mã môn tiên quyết không được trùng với mã môn đăng ký";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã môn tiên quyết"
                  fullWidth
                  error={!!errors.prerequisiteCode}
                  helperText={errors.prerequisiteCode?.message}
                  placeholder="VD: CS100"
                />
              )}
            />

            {registerCode && prerequisiteCode && registerCode === prerequisiteCode && (
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#fef3c7",
                  borderRadius: 1,
                  border: "1px solid #fbbf24",
                }}
              >
                <FormHelperText sx={{ color: "#d97706", m: 0 }}>
                  ⚠️ Mã môn đăng ký và mã môn tiên quyết không được trùng nhau
                </FormHelperText>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || registerCode === prerequisiteCode}
          >
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

