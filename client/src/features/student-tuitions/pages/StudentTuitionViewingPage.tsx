import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Typography,
  Container,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useStudentTuitionDetails } from "../queries/student-tuition.queries";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export const StudentTuitionViewingPage = () => {
  usePageMeta("Xem học phí", "Xem học phí từ lúc nhập học đến hiện tại");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const studentId = user?.id || "";

  const {
    data: tuitionData,
    isLoading,
    isError,
  } = useStudentTuitionDetails(studentId);

  if (!studentId) return <Alert severity="error">Vui lòng đăng nhập</Alert>;

  return (
    <Container maxWidth="xl" sx={{ width: "100%", pb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/public/home")}
              sx={{ color: "#B71C1C" }}
            >
              Quay lại
            </Button>
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoneyIcon sx={{ fontSize: 28, color: "#B71C1C" }} />
              <Typography variant="h5" fontWeight={700} color="#333">
                Xem học phí
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#B71C1C",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  STT
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Niên học học kỳ
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Học phí
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Alert severity="error">Có lỗi xảy ra</Alert>
                  </TableCell>
                </TableRow>
              ) : !tuitionData || tuitionData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Chưa có dữ liệu học phí
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {tuitionData.map((item: any, index: number) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.termName}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "#B71C1C" }}
                      >
                        {formatCurrency(item.price)} đ
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};
