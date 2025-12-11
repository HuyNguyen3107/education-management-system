import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { PrerequisiteSubject } from "../types/prerequisite-subject.types";

interface PrerequisiteSubjectDeleteDialogProps {
  open: boolean;
  prerequisiteSubject: PrerequisiteSubject | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const PrerequisiteSubjectDeleteDialog = ({
  open,
  prerequisiteSubject,
  onClose,
  onConfirm,
  isLoading,
  error,
}: PrerequisiteSubjectDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận xóa môn học tiên quyết</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Bạn có chắc chắn muốn xóa mối quan hệ tiên quyết này?
          {prerequisiteSubject && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon sx={{ fontSize: 20, color: "primary.main" }} />
                  <Chip
                    label={prerequisiteSubject.registerCode}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <ArrowForwardIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon sx={{ fontSize: 20, color: "success.main" }} />
                  <Chip
                    label={prerequisiteSubject.prerequisiteCode}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Môn học <strong>{prerequisiteSubject.registerCode}</strong> yêu cầu
                môn <strong>{prerequisiteSubject.prerequisiteCode}</strong> làm tiên quyết
              </Typography>
            </Box>
          )}
          <br />
          <Typography
            component="span"
            variant="body2"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

