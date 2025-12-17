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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useExamSchedule } from "../queries/student-credit-class.queries";

export const StudentExamSchedulePage = () => {
  usePageMeta("Xem lịch thi");
  const { user } = useAuthStore();
  const studentId = user?.id || "";

  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: examData, isLoading, isError } = useExamSchedule(studentId);

  // Filter data
  const filteredData = useMemo(() => {
    if (!examData) return [];

    let result = examData;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item: any) =>
          item.subjectCode.toLowerCase().includes(lowerSearch) ||
          (item.subjectName &&
            item.subjectName.toLowerCase().includes(lowerSearch))
      );
    }

    return result;
  }, [examData, searchTerm]);

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
        XEM LỊCH THI
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 300 }}>
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">Học kỳ 1 Năm học 2025-2026</MenuItem>
              {/* Add more semesters if needed */}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 300 }}>
            <Select value="personal" displayEmpty>
              <MenuItem value="personal">Lịch thi học kỳ cá nhân</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Các chức năng in/xuất file đã được lược bỏ để đơn giản giao diện */}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mã MH</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên môn học</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Sĩ số
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Ngày thi
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Giờ bắt đầu
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Phút
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Phòng thi
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Cơ sở
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Hình thức thi
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={10} sx={{ p: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="error" />
                      </InputAdornment>
                    ),
                  }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Có lỗi xảy ra
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Không tìm thấy lịch thi
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* Assuming all are "Thi kết thúc môn" for now, or we can group */}
                <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                  <TableCell colSpan={10} sx={{ fontWeight: "bold" }}>
                    Kỳ thi: Thi kết thúc môn
                  </TableCell>
                </TableRow>
                {filteredData.map((item: any, index: number) => (
                  <TableRow key={index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.subjectCode}</TableCell>
                    <TableCell>{item.subjectName}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">{item.examDate}</TableCell>
                    <TableCell align="center">{item.startTime}</TableCell>
                    <TableCell align="center">{item.duration}</TableCell>
                    <TableCell align="center">{item.room}</TableCell>
                    <TableCell align="center">
                      {/* Co so - placeholder */}
                    </TableCell>
                    <TableCell align="center">{item.form}</TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
