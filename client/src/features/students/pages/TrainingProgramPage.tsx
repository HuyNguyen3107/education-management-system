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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuthStore } from "@/store/auth.store";
import { useTrainingProgram } from "../queries/student.queries";
import { useMajors } from "@/features/majors/queries/major.queries";
import { useSpecializations } from "@/features/specializations/queries/specialization.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import ListIcon from "@mui/icons-material/List";
import { useMemo, Fragment, useState } from "react";
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

  // Sort training program by semester (year 1 to final year)
  const sortedTrainingProgram = useMemo(() => {
    if (!trainingProgram || trainingProgram.length === 0) return [];

    return [...trainingProgram].sort((a, b) => {
      // Parse semester format: "Năm X - Học kỳ Y"
      const parseSemester = (semesterStr: string) => {
        const yearMatch = semesterStr.match(/Năm\s*(\d+)/i);
        const semesterMatch = semesterStr.match(/Học kỳ\s*(\d+)/i);

        const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
        const semester = semesterMatch ? parseInt(semesterMatch[1], 10) : 0;

        return { year, semester };
      };

      const semesterA = parseSemester(a.semester);
      const semesterB = parseSemester(b.semester);

      // Sort by year first, then by semester
      if (semesterA.year !== semesterB.year) {
        return semesterA.year - semesterB.year;
      }
      return semesterA.semester - semesterB.semester;
    });
  }, [trainingProgram]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectResponseDto | null>(null);

  const handleOpenModal = (subject: SubjectResponseDto) => {
    setSelectedSubject(subject);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubject(null);
  };

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
    return specializations.reduce(
      (acc: { [x: string]: any }, spec: { id: string | number; name: any }) => {
        acc[spec.id] = spec.name;
        return acc;
      },
      {} as Record<string, string>
    );
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
          <TableCell colSpan={9}>
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
            <TableCell align="center">{getPeriods(subject, "total")}</TableCell>
            <TableCell align="center">
              {getPeriods(subject, "lý thuyết")}
            </TableCell>
            <TableCell align="center">
              {getPeriods(subject, "thực hành")}
            </TableCell>
            <TableCell align="center">
              <IconButton size="small" onClick={() => handleOpenModal(subject)}>
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
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select value="default" displayEmpty>
            <MenuItem value="default">CTĐT kế hoạch</MenuItem>
          </Select>
        </FormControl>
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
              <TableCell>Tổng tiết</TableCell>
              <TableCell>Lý thuyết</TableCell>
              <TableCell>Thực hành</TableCell>
              <TableCell>Tiết thành phần</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTrainingProgram && sortedTrainingProgram.length > 0 ? (
              sortedTrainingProgram.map(renderSemester)
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: "1px solid #e0e0e0", pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Chi tiết môn học - {selectedSubject?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedSubject?.subjectCode}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Tiết thành phần
            </Typography>
            {selectedSubject?.ingredientSecretion &&
            Array.isArray(selectedSubject.ingredientSecretion) &&
            selectedSubject.ingredientSecretion.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell>Tên thành phần</TableCell>
                      <TableCell align="center">Số tiết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSubject.ingredientSecretion.map(
                      (item: any, idx: number) => (
                        <TableRow key={idx} hover>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">{item.periods}</TableCell>
                        </TableRow>
                      )
                    )}
                    <TableRow sx={{ bgcolor: "#f9fafb" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tổng cộng
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {selectedSubject.ingredientSecretion.reduce(
                          (sum: number, item: any) => sum + (item.periods || 0),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                Không có thông tin tiết thành phần
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Môn học tiên quyết
            </Typography>
            {selectedSubject?.prerequisites &&
            Array.isArray(selectedSubject.prerequisites) &&
            selectedSubject.prerequisites.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell>STT</TableCell>
                      <TableCell>Mã môn tiên quyết</TableCell>
                      <TableCell>Tên môn tiên quyết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSubject.prerequisites.map(
                      (prereq: any, idx: number) => (
                        <TableRow key={idx} hover>
                          <TableCell align="center">{idx + 1}</TableCell>
                          <TableCell>
                            <Typography
                              component="span"
                              sx={{
                                fontWeight: 600,
                                color: "#b71c1c",
                              }}
                            >
                              {prereq.prerequisiteCode}
                            </Typography>
                          </TableCell>
                          <TableCell>{prereq.prerequisiteName}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ py: 2 }}>
                Không có môn học tiên quyết
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #e0e0e0", pt: 1 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
