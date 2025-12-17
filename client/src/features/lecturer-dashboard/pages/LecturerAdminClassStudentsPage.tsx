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
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Group as GroupIcon } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLecturerAdministrativeClassStudents } from "../queries/lecturer-dashboard.queries";

export const LecturerAdminClassStudentsPage = () => {
  usePageMeta("Danh sách sinh viên lớp chủ nhiệm");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: students, isLoading } =
    useLecturerAdministrativeClassStudents(id || "");

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/lecturer/admin-classes")}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách lớp chủ nhiệm
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Danh sách sinh viên lớp chủ nhiệm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem danh sách sinh viên thuộc lớp sinh hoạt mà bạn đang phụ trách.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "background.paper",
              px: 2,
              py: 1,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
            }}
          >
            <GroupIcon color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Tổng sinh viên
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {students?.length || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã sinh viên</TableCell>
              <TableCell>Họ và tên</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((student, index) => (
              <TableRow key={student.studentId} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.studentCode}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {student.studentName}
                </TableCell>
              </TableRow>
            ))}
            {students?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  Chưa có sinh viên nào trong lớp này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};


