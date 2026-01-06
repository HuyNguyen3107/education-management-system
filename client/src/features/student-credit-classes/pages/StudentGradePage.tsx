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
  CircularProgress,
  Alert,
  IconButton,
  Modal,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useStudentGrades } from "../queries/student-credit-class.queries";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const StudentGradePage = () => {
  usePageMeta("Xem điểm");
  const { user } = useAuthStore();
  const studentId = user?.id || "";

  const { data: gradesData, isLoading, isError } = useStudentGrades(studentId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const handleOpenModal = (subject: any) => {
    setSelectedSubject(subject);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubject(null);
  };

  // Group by Semester and sort chronologically
  const groupedData = useMemo(() => {
    if (!gradesData) return {};
    const groups: Record<string, any[]> = {};

    gradesData.forEach((item: any) => {
      // Parse semester to determine academic year
      // Semester format: "1" or "2" (we need to infer academic year)
      // For current implementation, we'll use semester number and infer year from current date
      const semesterNum = parseInt(item.semester, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // 1-12

      // Determine academic year based on semester and current date
      // Semester 1: Sep-Jan (months 9-1) -> Academic year: currentYear - currentYear+1
      // Semester 2: Feb-Aug (months 2-8) -> Academic year: currentYear-1 - currentYear
      let academicYearStart, academicYearEnd;

      if (semesterNum === 1) {
        if (currentMonth >= 9) {
          academicYearStart = currentYear;
          academicYearEnd = currentYear + 1;
        } else {
          academicYearStart = currentYear - 1;
          academicYearEnd = currentYear;
        }
      } else {
        // semesterNum === 2
        if (currentMonth >= 2 && currentMonth <= 8) {
          academicYearStart = currentYear - 1;
          academicYearEnd = currentYear;
        } else {
          academicYearStart = currentYear;
          academicYearEnd = currentYear + 1;
        }
      }

      const key = `Học kỳ ${semesterNum} - Năm học ${academicYearStart}-${academicYearEnd}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    // Sort semesters chronologically (newest first)
    const sortedGroups: Record<string, any[]> = {};
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      // Extract year and semester from key
      const extractInfo = (key: string) => {
        const match = key.match(/Học kỳ (\d+) - Năm học (\d+)-(\d+)/);
        if (match) {
          return {
            semester: parseInt(match[1], 10),
            yearStart: parseInt(match[2], 10),
            yearEnd: parseInt(match[3], 10),
          };
        }
        return { semester: 0, yearStart: 0, yearEnd: 0 };
      };

      const aInfo = extractInfo(a);
      const bInfo = extractInfo(b);

      // Sort by year descending, then by semester descending
      if (aInfo.yearStart !== bInfo.yearStart) {
        return bInfo.yearStart - aInfo.yearStart;
      }
      return bInfo.semester - aInfo.semester;
    });

    sortedKeys.forEach((key) => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [gradesData]);

  // Calculate summary for a group
  const calculateSummary = (items: any[]) => {
    // Placeholder logic for GPA
    // Needs credit count and scores
    let totalCredits = 0;
    let totalScore10 = 0;
    let totalScore4 = 0;

    items.forEach((item) => {
      if (item.examScore !== null) {
        // Only count if graded
        totalCredits += item.numberOfCredit;
        totalScore10 += (item.totalScore10 || 0) * item.numberOfCredit;
        totalScore4 += (item.totalScore4 || 0) * item.numberOfCredit;
      }
    });

    const avg10 = totalCredits > 0 ? totalScore10 / totalCredits : 0;
    const avg4 = totalCredits > 0 ? totalScore4 / totalCredits : 0;

    return {
      avg10: avg10.toFixed(2),
      avg4: avg4.toFixed(2),
      credits: totalCredits,
      accumulatedCredits: 0, // Placeholder
      accumulatedAvg10: 0, // Placeholder
      accumulatedAvg4: 0, // Placeholder
      classification: "Khá", // Placeholder
    };
  };

  if (!studentId) return <Alert severity="error">Vui lòng đăng nhập</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        color="error"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box component="span" sx={{ fontSize: "1.2rem" }}>
          ⚛
        </Box>{" "}
        XEM ĐIỂM
      </Typography>

      {/* Các chức năng in/xuất file đã được lược bỏ để đơn giản giao diện */}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mã MH</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Nhóm/tổ môn học
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên môn học</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Số tín chỉ
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Điểm thi
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Điểm TK (10)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Điểm TK (4)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Điểm TK (C)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Kết quả
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Chi tiết
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  Có lỗi xảy ra
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedData).map(([semester, items]) => {
                const summary = calculateSummary(items);
                return (
                  <>
                    <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                      <TableCell colSpan={11} sx={{ fontWeight: "bold" }}>
                        {semester}
                      </TableCell>
                    </TableRow>
                    {items.map((item: any, index: number) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.subjectCode}</TableCell>
                        <TableCell align="center">{item.group}</TableCell>
                        <TableCell>{item.subjectName}</TableCell>
                        <TableCell align="center">
                          {item.numberOfCredit}
                        </TableCell>
                        <TableCell align="center">{item.examScore}</TableCell>
                        <TableCell align="center">
                          {item.totalScore10}
                        </TableCell>
                        <TableCell align="center">{item.totalScore4}</TableCell>
                        <TableCell align="center">{item.letterScore}</TableCell>
                        <TableCell align="center">
                          {item.passed ? (
                            <CheckIcon color="success" fontSize="small" />
                          ) : (
                            <CloseIcon color="error" fontSize="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal(item)}
                          >
                            <ListIcon fontSize="small" color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow sx={{ bgcolor: "#ffebee" }}>
                      <TableCell colSpan={11}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 2,
                            fontSize: "0.875rem",
                          }}
                        >
                          <Box>
                            <div>
                              - Điểm trung bình học kỳ hệ 4:{" "}
                              <b>{summary.avg4}</b>
                            </div>
                            <div>
                              - Điểm trung bình học kỳ hệ 10:{" "}
                              <b>{summary.avg10}</b>
                            </div>
                            <div>
                              - Số tín chỉ đạt học kỳ: <b>{summary.credits}</b>
                            </div>
                          </Box>
                          <Box>
                            <div>
                              - Điểm trung bình tích lũy hệ 4: <b>...</b>
                            </div>
                            <div>
                              - Điểm trung bình tích lũy hệ 10: <b>...</b>
                            </div>
                            <div>
                              - Số tín chỉ tích lũy: <b>...</b>
                            </div>
                          </Box>
                          <Box>
                            <div>
                              - Phân loại điểm trung bình HK:{" "}
                              <span style={{ color: "#d32f2f" }}>...</span>
                            </div>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {selectedSubject?.subjectName.toUpperCase()}
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Tên thành phần
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Trọng số (%)
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Điểm thành phần
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSubject?.scoreComponents?.length > 0 ? (
                  selectedSubject.scoreComponents.map(
                    (comp: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell align="center">{comp.weight}</TableCell>
                        <TableCell align="center">{comp.score}</TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Chưa có điểm chi tiết
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleCloseModal}
            >
              Đóng
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
