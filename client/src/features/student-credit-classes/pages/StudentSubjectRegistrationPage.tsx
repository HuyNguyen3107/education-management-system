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
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  useRegistrationInfo,
  useStudentCreditClassesByStudent,
  useCreateStudentCreditClass,
  useDeleteStudentCreditClass,
  studentCreditClassQueryKeys,
} from "../queries/student-credit-class.queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ScoreItem } from "../types/student-credit-class.types";

// Helper to format schedule for display
const formatSchedule = (schedule: any[]) => {
  if (!schedule || schedule.length === 0) return "-";
  return schedule
    .map((s) => `Thứ ${s.day} (${s.startTime}-${s.endTime}, ${s.room})`)
    .join("; ");
};

export const StudentSubjectRegistrationPage = () => {
  usePageMeta("Đăng ký môn học");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const studentId = user?.id || "";

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: availableClasses,
    isLoading: isLoadingAvailable,
    error: availableError,
  } = useRegistrationInfo(studentId);

  const { data: enrolledClasses, isLoading: isLoadingEnrolled } =
    useStudentCreditClassesByStudent(studentId);

  const createMutation = useCreateStudentCreditClass();
  const deleteMutation = useDeleteStudentCreditClass();

  // Filter available classes
  const filteredAvailableClasses = useMemo(() => {
    if (!availableClasses) return [];
    if (!searchTerm) return availableClasses;

    const lowerSearch = searchTerm.toLowerCase();
    return availableClasses.filter(
      (c: any) =>
        c.subjectCode.toLowerCase().includes(lowerSearch) ||
        (c.name && c.name.toLowerCase().includes(lowerSearch))
    );
  }, [availableClasses, searchTerm]);

  // Enrich enrolled classes with details from available classes if possible,
  // or we rely on what the API returns. The API for student-credit-classes might not return full subject details.
  // Ideally, we would fetch CreditClass details for each enrolled class, or the API should return enriched data.
  // For now, let's assume enrolledClasses contains basic info and we might need to match with availableClasses to show names if missing.
  // Actually, let's assume the enrolled list API returns minimal data, so we might need to fetch CreditClass details or map from available.
  // However, `availableClasses` only contains classes *open for registration*. Enrolled classes might be from previous semesters (though unlikely in this context).
  // Let's assume for this specific registration page, we only care about current semester enrollments.
  // The `getStudentCreditClassesByStudentId` returns all. We should probably filter by current semester if we knew it.

  // Helper to check if already enrolled
  const isEnrolled = (creditClassId: string) => {
    return enrolledClasses?.some((ec) => ec.creditClassId === creditClassId);
  };

  const handleRegister = (creditClassId: string) => {
    if (isEnrolled(creditClassId)) {
      toast.warning("Bạn đã đăng ký lớp này rồi");
      return;
    }

    createMutation.mutate(
      {
        studentId,
        creditClassId,
        scores: [], // Empty initial scores
        examSchedule: [],
      },
      {
        onSuccess: () => {
          toast.success("Đăng ký thành công");
          queryClient.invalidateQueries({
            queryKey: studentCreditClassQueryKeys.byStudent(studentId),
          });
          // Also refetch available to update enrolled counts if we were using real-time,
          // but here we just need to update our "Enrolled" list.
          // Note: "availableClasses" might need refetching if we want to update the "enrolledCount" displayed there.
          queryClient.invalidateQueries({
            queryKey: studentCreditClassQueryKeys.registrationInfo(studentId),
          });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Đăng ký thất bại");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký lớp này?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Hủy đăng ký thành công");
          queryClient.invalidateQueries({
            queryKey: studentCreditClassQueryKeys.byStudent(studentId),
          });
          queryClient.invalidateQueries({
            queryKey: studentCreditClassQueryKeys.registrationInfo(studentId),
          });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Hủy đăng ký thất bại");
        },
      });
    }
  };

  // Enriched Enrolled List for Display
  // We try to find class details in `availableClasses`. If not found (maybe full now?), we might show placeholders or need another API.
  // But for the purpose of this task, let's try to map.
  const enrichedEnrolledList = useMemo(() => {
    if (!enrolledClasses) return [];

    return enrolledClasses.map((ec) => {
      // Find detail in availableClasses
      const detail = availableClasses?.find(
        (ac: any) => ac.id === ec.creditClassId
      );

      return {
        ...ec,
        subjectCode: detail?.subjectCode || "Loading...",
        subjectName: detail?.name || "Loading...",
        group: detail?.group,
        numberOfCredit: detail?.numberOfCredit, // API might not return this in CreditClassResponseDto, checking...
        // Wait, CreditClassResponseDto doesn't have numberOfCredit. Subject has it.
        // We might need to fetch it or the backend should include it.
        // For now, let's omit or show placeholder.
        schedule: detail?.schedule,
      };
    });
    // Filter only those that seem to be relevant to current registration if possible?
    // Or just show all. The UI image implies showing "Danh sách môn học đã đăng ký".
  }, [enrolledClasses, availableClasses]);

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
        ĐĂNG KÝ MÔN HỌC
      </Typography>

      {/* Available Classes Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Danh sách môn học mở cho đăng ký
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo mã môn hoặc tên môn..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {availableError ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {(availableError as any).response?.data?.message ||
              "Hiện không trong thời gian đăng ký hoặc có lỗi xảy ra."}
          </Alert>
        ) : (
          <TableContainer sx={{ maxHeight: 400 }} className="custom-scrollbar">
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Đăng ký</TableCell>
                  <TableCell>Mã MH</TableCell>
                  <TableCell>Tên môn học</TableCell>
                  <TableCell>Nhóm</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Còn lại</TableCell>
                  <TableCell>Thời khóa biểu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingAvailable ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : filteredAvailableClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAvailableClasses.map((item: any) => {
                    const remaining = item.quantity - (item.enrolledCount || 0);
                    const enrolled = isEnrolled(item.id);

                    return (
                      <TableRow key={item.id} hover selected={enrolled}>
                        <TableCell>
                          <Button
                            size="small"
                            variant={enrolled ? "contained" : "outlined"}
                            color={enrolled ? "success" : "primary"}
                            disabled={enrolled || remaining <= 0}
                            onClick={() => handleRegister(item.id)}
                          >
                            {enrolled ? "Đã ĐK" : "Đăng ký"}
                          </Button>
                        </TableCell>
                        <TableCell>{item.subjectCode}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.group}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{remaining}</TableCell>
                        <TableCell>{formatSchedule(item.schedule)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Enrolled Classes Section */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Danh sách môn học đã đăng ký
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Xóa</TableCell>
                <TableCell>Mã MH</TableCell>
                <TableCell>Tên môn học</TableCell>
                <TableCell>Nhóm</TableCell>
                <TableCell>Ngày đăng ký</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thời khóa biểu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingEnrolled ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : enrichedEnrolledList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Chưa đăng ký môn học nào
                  </TableCell>
                </TableRow>
              ) : (
                enrichedEnrolledList.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>{item.subjectCode}</TableCell>
                    <TableCell>{item.subjectName}</TableCell>
                    <TableCell>{item.group}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{ color: "green", fontWeight: "bold" }}
                      >
                        Đã đăng ký
                      </Box>
                    </TableCell>
                    <TableCell>{formatSchedule(item.schedule)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
