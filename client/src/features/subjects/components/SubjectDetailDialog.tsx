import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Subject } from "../types/subject.types";

interface SubjectDetailDialogProps {
  open: boolean;
  onClose: () => void;
  subject: Subject | null;
}

export const SubjectDetailDialog = ({
  open,
  onClose,
  subject,
}: SubjectDetailDialogProps) => {
  if (!subject) return null;

  const ingredients = subject.ingredientSecretion || [];
  const totalPeriods = ingredients.reduce((sum, item) => sum + (item.periods || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ textTransform: "uppercase" }}>
          {subject.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#374151",
                    width: 60,
                  }}
                >
                  STT
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                  Tên thành phần
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#374151", width: 100 }}
                  align="right"
                >
                  Số tiết
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="text.secondary">
                      Chưa có thông tin tiết thành phần
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                ingredients.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { bgcolor: "#f9fafb" },
                      borderBottom: "1px solid",
                      borderColor:
                        index === 0 || index === 2 ? "#ef4444" : "#e5e7eb",
                    }}
                  >
                    <TableCell sx={{ color: "#6b7280" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1f2937" }}>{item.name}</TableCell>
                    <TableCell align="right" sx={{ color: "#1f2937", fontWeight: 500 }}>
                      {item.periods}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {/* Total row */}
              {ingredients.length > 0 && (
                <TableRow sx={{ bgcolor: "#f3f4f6" }}>
                  <TableCell colSpan={2} sx={{ fontWeight: 700, color: "#1f2937" }}>
                    Tổng cộng
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1rem" }}
                  >
                    {totalPeriods}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Additional Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Thông tin môn học
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <Typography variant="body2">
              <strong>Mã môn:</strong> {subject.subjectCode}
            </Typography>
            <Typography variant="body2">
              <strong>Số tín chỉ:</strong> {subject.numberOfCredit || "-"}
            </Typography>
            <Typography variant="body2">
              <strong>Học kỳ:</strong> {subject.semester}
            </Typography>
            <Typography variant="body2">
              <strong>Tổng số tiết:</strong> {totalPeriods}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="warning" variant="outlined">
          ✕ Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

