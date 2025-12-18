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
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import type {
  CreateSubjectRequest,
  Subject,
  IngredientSecretion,
} from "../types/subject.types";
import { useMajors } from "../../majors/queries/major.queries";
import { useSpecializations } from "../../specializations/queries/specialization.queries";
import type { Specialization } from "@/features/specializations/types/specialization.types";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface SubjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubjectRequest) => void;
  initialData?: Subject | null;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  subjectCode: string;
  majorId: string;
  specializationId: string;
  numberOfCredit: number | "";
  semester: string;
  ingredientSecretion: IngredientSecretion[];
}

// Default ingredient secretion components
const DEFAULT_INGREDIENTS: IngredientSecretion[] = [
  { name: "Lý thuyết", periods: 30 },
  { name: "Thực hành", periods: 15 },
  { name: "Bài tập", periods: 0 },
  { name: "Tự học", periods: 0 },
  { name: "Bài tập lớn", periods: 0 },
];

export const SubjectFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: SubjectFormDialogProps) => {
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
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      subjectCode: "",
      majorId: "",
      specializationId: "",
      numberOfCredit: "",
      semester: "",
      ingredientSecretion: DEFAULT_INGREDIENTS,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredientSecretion",
  });

  const selectedMajorId = watch("majorId");
  const ingredientSecretion = watch("ingredientSecretion");

  // Calculate total periods
  const totalPeriods =
    ingredientSecretion?.reduce((sum, item) => sum + (item.periods || 0), 0) ||
    0;

  // Filter specializations by selected major
  const filteredSpecializations = selectedMajorId
    ? specializations.filter(
        (s: Specialization) => s.majorId === selectedMajorId
      )
    : specializations;

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        subjectCode: initialData.subjectCode,
        majorId: initialData.majorId || "",
        specializationId: initialData.specializationId || "",
        numberOfCredit: initialData.numberOfCredit || "",
        semester: initialData.semester,
        ingredientSecretion:
          initialData.ingredientSecretion?.length > 0
            ? initialData.ingredientSecretion
            : DEFAULT_INGREDIENTS,
      });
    } else {
      reset({
        name: "",
        subjectCode: "",
        majorId: "",
        specializationId: "",
        numberOfCredit: "",
        semester: "",
        ingredientSecretion: DEFAULT_INGREDIENTS,
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    // Filter out ingredients with empty name
    const validIngredients = data.ingredientSecretion.filter(
      (item) => item.name.trim() !== ""
    );

    const cleanData: CreateSubjectRequest = {
      name: data.name,
      subjectCode: data.subjectCode,
      semester: data.semester,
      ingredientSecretion: validIngredients,
      ...(data.majorId && { majorId: data.majorId }),
      ...(data.specializationId && { specializationId: data.specializationId }),
      ...(data.numberOfCredit !== "" && {
        numberOfCredit: Number(data.numberOfCredit),
      }),
    };
    onSubmit(cleanData);
  };

  const handleAddIngredient = () => {
    append({ name: "", periods: 0 });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật môn học" : "Thêm mới môn học"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên môn học là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên môn học"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Nhập tên môn học (Ví dụ: Vật lý 1 và Thí nghiệm)"
                />
              )}
            />

            <Controller
              name="subjectCode"
              control={control}
              rules={{ required: "Mã môn học là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã môn học"
                  fullWidth
                  error={!!errors.subjectCode}
                  helperText={errors.subjectCode?.message}
                  placeholder="Nhập mã môn học (Ví dụ: PH1001)"
                />
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
                    {filteredSpecializations.map((spec: Specialization) => (
                      <MenuItem key={spec.id} value={spec.id}>
                        {spec.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="numberOfCredit"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Số tín chỉ"
                  fullWidth
                  placeholder="Nhập số tín chỉ"
                  inputProps={{ min: 0, step: 0.5 }}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                />
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

            {/* Ingredient Secretion Section */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tiết thành phần
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tổng số tiết: <strong>{totalPeriods}</strong>
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddIngredient}
                  variant="outlined"
                >
                  Thêm
                </Button>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: 600, width: 50 }}>
                        STT
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Tên thành phần
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, width: 100 }}
                        align="center"
                      >
                        Số tiết
                      </TableCell>
                      <TableCell sx={{ width: 50 }} align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Controller
                            name={`ingredientSecretion.${index}.name`}
                            control={control}
                            rules={{ required: "Bắt buộc" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                variant="standard"
                                placeholder="Nhập tên thành phần"
                                InputProps={{ disableUnderline: true }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Controller
                            name={`ingredientSecretion.${index}.periods`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                type="number"
                                variant="outlined"
                                inputProps={{
                                  min: 0,
                                  style: { textAlign: "center" },
                                }}
                                sx={{ width: 70 }}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
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
