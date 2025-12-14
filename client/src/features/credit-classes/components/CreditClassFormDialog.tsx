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
  InputAdornment,
  Typography,
  IconButton,
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
  CreateCreditClassRequest,
  CreditClass,
  ScheduleItem,
} from "../types/credit-class.types";
import { useLecturers } from "../../lecturers/queries/lecturer.queries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface CreditClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCreditClassRequest) => void;
  initialData?: CreditClass | null;
  isLoading?: boolean;
}

interface FormData {
  subjectCode: string;
  teacherId: string;
  group: string;
  name: string;
  quantity: number;
  room: string;
  semester: string;
  schedule: ScheduleItem[];
}

// Default schedule item
const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    dayOfWeek: "2",
    startPeriod: 1,
    numberOfPeriods: 2,
    startDate: "",
    endDate: "",
    room: "",
  },
];

// Days of week options
const DAYS_OF_WEEK = [
  { value: "2", label: "Thứ 2" },
  { value: "3", label: "Thứ 3" },
  { value: "4", label: "Thứ 4" },
  { value: "5", label: "Thứ 5" },
  { value: "6", label: "Thứ 6" },
  { value: "7", label: "Thứ 7" },
  { value: "CN", label: "Chủ nhật" },
];

export const CreditClassFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: CreditClassFormDialogProps) => {
  const { data: lecturers = [] } = useLecturers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      subjectCode: "",
      teacherId: "",
      group: "",
      name: "",
      quantity: 30,
      room: "",
      semester: "",
      schedule: DEFAULT_SCHEDULE,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        subjectCode: initialData.subjectCode,
        teacherId: initialData.teacherId,
        group: initialData.group || "",
        name: initialData.name,
        quantity: initialData.quantity,
        room: initialData.room || "",
        semester: initialData.semester,
        schedule:
          initialData.schedule && initialData.schedule.length > 0
            ? initialData.schedule
            : DEFAULT_SCHEDULE,
      });
    } else {
      reset({
        subjectCode: "",
        teacherId: "",
        group: "",
        name: "",
        quantity: 30,
        room: "",
        semester: "",
        schedule: DEFAULT_SCHEDULE,
      });
    }
  }, [initialData, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    // Filter out empty schedule items
    const validSchedule = data.schedule.filter(
      (item) => item.dayOfWeek && item.startPeriod && item.numberOfPeriods
    );

    const cleanData: CreateCreditClassRequest = {
      subjectCode: data.subjectCode,
      teacherId: data.teacherId,
      name: data.name,
      quantity: data.quantity,
      semester: data.semester,
      schedule: validSchedule,
      ...(data.group && { group: data.group }),
      ...(data.room && { room: data.room }),
    };
    onSubmit(cleanData);
  };

  const handleAddSchedule = () => {
    append({
      dayOfWeek: "2",
      startPeriod: 1,
      numberOfPeriods: 2,
      startDate: "",
      endDate: "",
      room: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật lớp tín chỉ" : "Thêm mới lớp tín chỉ"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên lớp tín chỉ là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên lớp tín chỉ"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Nhập tên lớp tín chỉ (Ví dụ: Lập trình Web - Nhóm 1)"
                />
              )}
            />

            <Controller
              name="subjectCode"
              control={control}
              rules={{ required: "Mã học phần là bắt buộc" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã học phần"
                  fullWidth
                  error={!!errors.subjectCode}
                  helperText={errors.subjectCode?.message}
                  placeholder="Nhập mã học phần (Ví dụ: IT001)"
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
              name="group"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nhóm"
                  fullWidth
                  placeholder="Nhập tên nhóm (Ví dụ: 01, 02...)"
                />
              )}
            />

            <Controller
              name="quantity"
              control={control}
              rules={{
                required: "Sĩ số là bắt buộc",
                min: { value: 1, message: "Sĩ số phải lớn hơn 0" },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Sĩ số"
                  fullWidth
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  placeholder="Nhập sĩ số lớp học"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">sinh viên</InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 0)
                  }
                />
              )}
            />

            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phòng học chung"
                  fullWidth
                  placeholder="Nhập phòng học (Ví dụ: A101, B205...)"
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

            {/* Schedule Section */}
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
                  Lịch học
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddSchedule}
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
                      <TableCell sx={{ fontWeight: 600 }}>Thứ</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">
                        Tiết bắt đầu
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="center">
                        Số tiết
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Thời gian học
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Phòng</TableCell>
                      <TableCell sx={{ width: 50 }} align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Controller
                            name={`schedule.${index}.dayOfWeek`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                size="small"
                                sx={{ minWidth: 100 }}
                              >
                                {DAYS_OF_WEEK.map((day) => (
                                  <MenuItem key={day.value} value={day.value}>
                                    {day.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Controller
                            name={`schedule.${index}.startPeriod`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                type="number"
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 1,
                                  max: 15,
                                  style: { textAlign: "center" },
                                }}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Controller
                            name={`schedule.${index}.numberOfPeriods`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                type="number"
                                sx={{ width: 70 }}
                                inputProps={{
                                  min: 1,
                                  max: 10,
                                  style: { textAlign: "center" },
                                }}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Controller
                              name={`schedule.${index}.startDate`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  type="date"
                                  sx={{ width: 140 }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                            <Typography variant="body2">đến</Typography>
                            <Controller
                              name={`schedule.${index}.endDate`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  size="small"
                                  type="date"
                                  sx={{ width: 140 }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`schedule.${index}.room`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                size="small"
                                sx={{ width: 100 }}
                                placeholder="Phòng"
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
