import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type {
  CreateSpecializationRequest,
  Specialization,
} from "../types/specialization.types";
import { useMajors } from "../../majors/queries/major.queries";

interface SpecializationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSpecializationRequest) => void;
  initialData?: Specialization | null;
  isLoading?: boolean;
}

export const SpecializationFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: SpecializationFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSpecializationRequest>({
    defaultValues: {
      name: "",
      majorId: "",
    },
  });

  // Fetch majors for the dropdown
  // Requesting a large size to get all majors for the dropdown
  const { data: majorsData, isLoading: isLoadingMajors } = useMajors({
    page: 0,
    size: 100,
  });
  const majors = majorsData?.content || [];

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
        {initialData ? "Cập nhật chuyên ngành" : "Thêm mới chuyên ngành"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên chuyên ngành là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên chuyên ngành"
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
                <TextField
                  {...field}
                  select
                  label="Ngành học"
                  fullWidth
                  error={!!errors.majorId}
                  helperText={errors.majorId?.message}
                  disabled={isLoadingMajors}
                >
                  {isLoadingMajors ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  ) : (
                    majors.map((major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isLoadingMajors}
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
