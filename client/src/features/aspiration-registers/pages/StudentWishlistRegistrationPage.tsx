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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Grid,
} from "@mui/material";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuthStore } from "@/store/auth.store";
import {
  useAspirationRegistersByStudent,
  useAvailableSubjects,
  useCreateAspirationRegister,
  useDeleteAspirationRegister,
  aspirationRegisterQueryKeys,
} from "../queries/aspiration-register.queries";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export const StudentWishlistRegistrationPage = () => {
  usePageMeta("Đăng ký nguyện vọng");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const studentId = user?.id || "";

  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [reason, setReason] = useState("");
  const [group, setGroup] = useState(""); // Not used in API yet but in UI

  const {
    data: availableSubjects,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useAvailableSubjects(studentId);

  const { data: registeredList, isLoading: isLoadingList } =
    useAspirationRegistersByStudent(studentId);

  const createMutation = useCreateAspirationRegister();
  const deleteMutation = useDeleteAspirationRegister();

  const handleRegister = () => {
    if (!selectedSubjectCode || !reason) {
      toast.error("Vui lòng chọn môn học và nhập lý do");
      return;
    }

    const subject = availableSubjects?.find(
      (s: any) => s.subjectCode === selectedSubjectCode
    );

    if (!subject) return;

    createMutation.mutate(
      {
        studentId,
        subjectCode: selectedSubjectCode,
        reason,
        semester: subject.semester, // Use subject's semester or active semester?
        // Logic: Backend checks semester compatibility, but here we need to send a semester string.
        // Actually, the API requires 'semester'.
        // Since getAvailableSubjects returns subjects valid for the current wishlist semester,
        // we can probably use the subject's semester or the semester returned by backend if included.
        // Let's assume Subject has 'semester' field.
      },
      {
        onSuccess: () => {
          toast.success("Đăng ký thành công");
          setSelectedSubjectCode("");
          setReason("");
          setGroup("");
          queryClient.invalidateQueries({
            queryKey: aspirationRegisterQueryKeys.byStudent(studentId),
          });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Đăng ký thất bại");
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đăng ký này?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Xóa thành công");
          queryClient.invalidateQueries({
            queryKey: aspirationRegisterQueryKeys.byStudent(studentId),
          });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Xóa thất bại");
        },
      });
    }
  };

  if (!studentId) return <Alert severity="error">Vui lòng đăng nhập</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      {/* Form Registration */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          color="error"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box component="span" sx={{ fontSize: "1.2rem" }}>
            ⚛
          </Box>{" "}
          ĐĂNG KÝ NGUYỆN VỌNG
        </Typography>

        {subjectsError ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {(subjectsError as any).response?.data?.message ||
              "Hiện không trong thời gian đăng ký hoặc có lỗi xảy ra."}
          </Alert>
        ) : (
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="subject-select-label">Môn học *</InputLabel>
                <Select
                  labelId="subject-select-label"
                  value={selectedSubjectCode}
                  label="Môn học *"
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  disabled={isLoadingSubjects}
                >
                  {availableSubjects?.map((subject: any) => (
                    <MenuItem key={subject.id} value={subject.subjectCode}>
                      {subject.subjectCode} - {subject.name} (
                      {subject.numberOfCredit} TC)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Nhóm/tổ môn học"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Lý do *"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleRegister}
                disabled={createMutation.isPending || isLoadingSubjects}
              >
                Đăng ký
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* List Registered */}
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h6"
          color="error"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box component="span" sx={{ fontSize: "1.2rem" }}>
            ⚛
          </Box>{" "}
          DANH SÁCH ĐÃ ĐĂNG KÝ NGUYỆN VỌNG
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã MH</TableCell>
                <TableCell>Tên môn học</TableCell>
                <TableCell>Mã nhóm</TableCell>
                <TableCell>Tổ TH</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Ngày đăng ký</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell>Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingList ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : registeredList?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Chưa có đăng ký nào
                  </TableCell>
                </TableRow>
              ) : (
                registeredList?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.subjectCode}</TableCell>
                    <TableCell>
                      {/* We might need to look up subject name if not in item */}
                      {/* For now assuming backend might need to return subject name or we lookup from availableSubjects (if present) or just code */}
                      {/* To be safe, the DTO should probably include subjectName. Currently it doesn't. */}
                      {/* I'll use a placeholder or try to find in availableSubjects */}
                      {availableSubjects?.find(
                        (s: any) => s.subjectCode === item.subjectCode
                      )?.name || "Loading..."}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>{item.semester}</TableCell>
                    <TableCell>
                      <IconButton
                        color="warning"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
