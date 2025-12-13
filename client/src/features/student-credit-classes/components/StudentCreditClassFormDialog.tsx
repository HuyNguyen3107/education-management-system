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
  IconButton,
  Paper,
  Divider,
  InputAdornment,
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
  CreateStudentCreditClassRequest,
  StudentCreditClass,
  ScoreItem,
  ExamScheduleItem,
} from "../types/student-credit-class.types";
import { useStudents } from "../../students/queries/student.queries";
import { useCreditClasses } from "../../credit-classes/queries/credit-class.queries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface StudentCreditClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentCreditClassRequest) => void;
  initialData?: StudentCreditClass | null;
  isLoading?: boolean;
}

interface FormData {
  studentId: string;
  creditClassId: string;
  scores: ScoreItem[];
  examSchedule: ExamScheduleItem[];
}

// Default score components
const DEFAULT_SCORES: ScoreItem[] = [
  { name: "Chuyên cần", percentage: 10, score: 0 },
  { name: "Kiểm tra", percentage: 10, score: 0 },
  { name: "Thực hành", percentage: 20, score: 0 },
  { name: "Bài tập", percentage: 0, score: 0 },
  { name: "Điểm thi", percentage: 60, score: 0 },
];

export const StudentCreditClassFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: StudentCreditClassFormDialogProps) => {
  const { data: students = [] } = useStudents();
  const { data: creditClasses = [] } = useCreditClasses();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      studentId: "",
      creditClassId: "",
      scores: DEFAULT_SCORES,
      examSchedule: [],
    },
  });

  const {
    fields: scoreFields,
    append: appendScore,
    remove: removeScore,
  } = useFieldArray({
    control,
    name: "scores",
  });

  const {
    fields: examFields,
    append: appendExam,
    remove: removeExam,
  } = useFieldArray({
    control,
    name: "examSchedule",
  });

  const scores = watch("scores");
  const selectedCreditClassId = watch("creditClassId");

  // Get selected credit class info
  const selectedCreditClass = creditClasses.find(
    (cc) => cc.id === selectedCreditClassId
  );

  // Calculate average score
  const totalPercentage =
    scores?.reduce((acc, curr) => acc + (curr.percentage || 0), 0) || 0;
  const averageScore =
    scores && scores.length > 0 && totalPercentage > 0
      ? scores.reduce(
          (acc, curr) =>
            acc +
            ((curr.score || 0) * (curr.percentage || 0)) / totalPercentage,
          0
        )
      : 0;

  useEffect(() => {
    if (initialData) {
      reset({
        studentId: initialData.studentId,
        creditClassId: initialData.creditClassId,
        scores: initialData.scores?.length
          ? initialData.scores
          : DEFAULT_SCORES,
        examSchedule: initialData.examSchedule || [],
      });
    } else {
      reset({
        studentId: "",
        creditClassId: "",
        scores: DEFAULT_SCORES,
        examSchedule: [],
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    // Filter out empty scores
    const validScores = data.scores.filter((s) => s.name.trim() !== "");
    const validExams = data.examSchedule.filter(
      (e) => e.examType.trim() !== ""
    );

    const cleanData: CreateStudentCreditClassRequest = {
      studentId: data.studentId,
      creditClassId: data.creditClassId,
      scores: validScores.length > 0 ? validScores : undefined,
      examSchedule: validExams.length > 0 ? validExams : undefined,
    };
    onSubmit(cleanData);
  };

  const handleAddExam = () => {
    appendExam({
      examType: "",
      subjectCode: selectedCreditClass?.subjectCode || "",
      subjectName: selectedCreditClass?.name || "",
      quantity: 0,
      examDate: "",
      startTime: "",
      duration: 60,
      room: "",
      campus: "",
      examFormat: "Tự luận",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData
          ? "Cập nhật đăng ký lớp tín chỉ"
          : "Thêm mới đăng ký lớp tín chỉ"}
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
              name="creditClassId"
              control={control}
              rules={{ required: "Lớp tín chỉ là bắt buộc" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.creditClassId}>
                  <InputLabel>Lớp tín chỉ</InputLabel>
                  <Select {...field} label="Lớp tín chỉ">
                    {creditClasses.map((cc) => (
                      <MenuItem key={cc.id} value={cc.id}>
                        {cc.subjectCode} - {cc.name} ({cc.semester})
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.creditClassId?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {/* Scores Section */}
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
                    Điểm thành phần
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tổng trọng số: <strong>{totalPercentage}%</strong> | Điểm
                    trung bình:{" "}
                    <strong
                      style={{ color: averageScore >= 5 ? "green" : "red" }}
                    >
                      {averageScore.toFixed(2)}
                    </strong>
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    appendScore({ name: "", percentage: 0, score: 0 })
                  }
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
                        sx={{ fontWeight: 600, width: 120 }}
                        align="center"
                      >
                        Trọng số (%)
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, width: 120 }}
                        align="center"
                      >
                        Điểm
                      </TableCell>
                      <TableCell sx={{ width: 50 }} align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scoreFields.map((field, index) => (
                      <TableRow key={field.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Controller
                            name={`scores.${index}.name`}
                            control={control}
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
                            name={`scores.${index}.percentage`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                type="number"
                                variant="outlined"
                                inputProps={{
                                  min: 0,
                                  max: 100,
                                  style: { textAlign: "center" },
                                }}
                                sx={{ width: 80 }}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Controller
                            name={`scores.${index}.score`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                type="number"
                                variant="outlined"
                                inputProps={{
                                  min: 0,
                                  max: 10,
                                  step: 0.1,
                                  style: { textAlign: "center" },
                                }}
                                sx={{ width: 80 }}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
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
                            onClick={() => removeScore(index)}
                            disabled={scoreFields.length <= 1}
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

            <Divider />

            {/* Exam Schedule Section */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Lịch thi
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddExam}
                  variant="outlined"
                >
                  Thêm
                </Button>
              </Box>

              {examFields.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Chưa có lịch thi. Bấm "Thêm" để thêm lịch thi mới.
                </Typography>
              )}

              {examFields.map((field, index) => (
                <Paper
                  key={field.id}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, bgcolor: "#fafafa" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lịch thi #{index + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeExam(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Controller
                      name={`examSchedule.${index}.examType`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Kỳ thi</InputLabel>
                          <Select {...field} label="Kỳ thi">
                            <MenuItem value="Thi giữa kỳ">Thi giữa kỳ</MenuItem>
                            <MenuItem value="Thi kết thúc môn">
                              Thi kết thúc môn
                            </MenuItem>
                            <MenuItem value="Thi lại">Thi lại</MenuItem>
                            <MenuItem value="Thi cải thiện">
                              Thi cải thiện
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller
                        name={`examSchedule.${index}.subjectCode`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Mã môn học"
                            size="small"
                            fullWidth
                            placeholder="Ví dụ: BAS1224"
                          />
                        )}
                      />
                      <Controller
                        name={`examSchedule.${index}.subjectName`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Tên môn học"
                            size="small"
                            fullWidth
                            placeholder="Ví dụ: Vật lý 1 và thí nghiệm"
                          />
                        )}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller
                        name={`examSchedule.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Sĩ số"
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  SV
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        )}
                      />
                      <Controller
                        name={`examSchedule.${index}.examDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="date"
                            label="Ngày thi"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller
                        name={`examSchedule.${index}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="time"
                            label="Giờ bắt đầu"
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                      <Controller
                        name={`examSchedule.${index}.duration`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Thời gian làm bài"
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  phút
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10) || 0)
                            }
                          />
                        )}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Controller
                        name={`examSchedule.${index}.room`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phòng thi"
                            size="small"
                            fullWidth
                            placeholder="Ví dụ: 401-A2"
                          />
                        )}
                      />
                      <Controller
                        name={`examSchedule.${index}.campus`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Cơ sở"
                            size="small"
                            fullWidth
                            placeholder="Ví dụ: Cơ sở 1"
                          />
                        )}
                      />
                    </Box>

                    <Controller
                      name={`examSchedule.${index}.examFormat`}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Hình thức thi</InputLabel>
                          <Select {...field} label="Hình thức thi">
                            <MenuItem value="Tự luận">Tự luận</MenuItem>
                            <MenuItem value="Trắc nghiệm">Trắc nghiệm</MenuItem>
                            <MenuItem value="Vấn đáp">Vấn đáp</MenuItem>
                            <MenuItem value="Thực hành">Thực hành</MenuItem>
                            <MenuItem value="Tiểu luận">Tiểu luận</MenuItem>
                            <MenuItem value="Kết hợp">Kết hợp</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                </Paper>
              ))}
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
