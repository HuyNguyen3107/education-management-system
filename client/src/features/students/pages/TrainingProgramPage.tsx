import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useAuthStore } from "@/store/auth.store";
import { useTrainingProgram } from "../queries/student.queries";
import { useMajors } from "@/features/majors/queries/major.queries";
import { useSpecializations } from "@/features/specializations/queries/specialization.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ListIcon from "@mui/icons-material/List";
import CheckIcon from "@mui/icons-material/Check";
import { useMemo, Fragment } from "react";
import type {
  TrainingProgramDto,
  SubjectResponseDto,
} from "../types/student.types";

export const TrainingProgramPage = () => {
  usePageMeta("Chương trình đào tạo");
  const user = useAuthStore((state) => state.user);
  const {
    data: trainingProgram,
    isLoading,
    isError,
    error,
  } = useTrainingProgram(user?.id || "");

  const { data: majorsData } = useMajors({ size: 1000 });
  const majors = majorsData?.content || [];
  const { data: specializationsData } = useSpecializations({ size: 1000 });
  const specializations = specializationsData?.content || [];

  const majorMap = useMemo(() => {
    return majors.reduce((acc, major) => {
      acc[major.id] = major.name;
      return acc;
    }, {} as Record<string, string>);
  }, [majors]);

  const specializationMap = useMemo(() => {
    return specializations.reduce((acc: { [x: string]: any; }, spec: { id: string | number; name: any; }) => {
      acc[spec.id] = spec.name;
      return acc;
    }, {} as Record<string, string>);
  }, [specializations]);

  // Helper to calculate periods
  const getPeriods = (subject: SubjectResponseDto, type: string) => {
    if (
      !subject.ingredientSecretion ||
      !Array.isArray(subject.ingredientSecretion)
    ) {
      return 0;
    }
    // Assuming ingredientSecretion is [{ name: "Lý thuyết", periods: 30 }, ...]
    // Need to match type roughly
    if (type === "total") {
      return subject.ingredientSecretion.reduce(
        (sum: number, item: any) => sum + (item.periods || 0),
        0
      );
    }
    const item = subject.ingredientSecretion.find((i: any) =>
      i.name?.toLowerCase()?.includes(type.toLowerCase())
    );
    return item ? item.periods : 0;
  };

  const renderSemester = (semesterData: TrainingProgramDto) => {
    return (
      <Fragment key={semesterData.semester}>
        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
          <TableCell colSpan={11}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", pr: 2 }}
            >
              <Typography fontWeight="bold">{semesterData.semester}</Typography>
              <Typography fontWeight="bold" color="error">
                {semesterData.totalCredits}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {semesterData.subjects.map((subject, index) => (
          <TableRow key={subject.id} hover>
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell>{subject.subjectCode}</TableCell>
            <TableCell>{subject.name}</TableCell>
            <TableCell align="center">
              {subject.specializationId
                ? specializationMap[subject.specializationId]
                : subject.majorId
                ? majorMap[subject.majorId]
                : ""}
            </TableCell>
            <TableCell align="center">{subject.numberOfCredit}</TableCell>
            <TableCell align="center" sx={{ color: "red" }}>
              x
            </TableCell>
            <TableCell align="center" sx={{ color: "red" }}>
              {subject.isStudied ? <CheckIcon fontSize="small" /> : ""}
            </TableCell>
            <TableCell align="center">{getPeriods(subject, "total")}</TableCell>
            <TableCell align="center">
              {getPeriods(subject, "lý thuyết")}
            </TableCell>
            <TableCell align="center">
              {getPeriods(subject, "thực hành")}
            </TableCell>
            <TableCell align="center">
              <IconButton size="small">
                <ListIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </Fragment>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Có lỗi xảy ra khi tải chương trình đào tạo:{" "}
          {(error as any)?.message || "Lỗi không xác định"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Vui lòng kiểm tra lại kết nối server hoặc đảm bảo bạn đã chạy
          migration tạo bảng student_majors.
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="warning.main">
          Vui lòng đăng nhập để xem chương trình đào tạo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="error" fontWeight="bold">
          CHƯƠNG TRÌNH ĐÀO TẠO
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select value="default" displayEmpty>
            <MenuItem value="default">CTĐT kế hoạch</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1, color: "#d32f2f", borderColor: "#d32f2f" }}
          >
            In
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{ color: "#d32f2f", borderColor: "#d32f2f" }}
          >
            Xuất Excel
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã MH</TableCell>
              <TableCell>Tên môn học</TableCell>
              <TableCell>Chuyên ngành</TableCell>
              <TableCell>Số tín chỉ</TableCell>
              <TableCell>Môn bắt buộc</TableCell>
              <TableCell>Đã học</TableCell>
              <TableCell>Tổng tiết</TableCell>
              <TableCell>Lý thuyết</TableCell>
              <TableCell>Thực hành</TableCell>
              <TableCell>Tiết thành phần</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingProgram && trainingProgram.length > 0 ? (
              trainingProgram.map(renderSemester)
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
