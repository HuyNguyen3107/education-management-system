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
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLecturerAdministrativeClasses } from "../queries/lecturer-dashboard.queries";

export const LecturerAdminClassesPage = () => {
  usePageMeta("Lớp chủ nhiệm");
  const navigate = useNavigate();
  const {
    data: classes,
    isLoading,
    isError,
  } = useLecturerAdministrativeClasses();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Danh sách lớp chủ nhiệm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xem các lớp sinh hoạt mà bạn đang phụ trách và truy cập danh sách
            sinh viên.
          </Typography>
        </Box>
      </Box>

      <Paper>
        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã lớp</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : !classes || classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Chưa có lớp chủ nhiệm nào
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls) => (
                  <TableRow key={cls.id} hover>
                    <TableCell>
                      <Chip
                        label={cls.classCode}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {cls.createdAt
                        ? new Date(cls.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/lecturer/admin-classes/${cls.id}/students`)
                        }
                      >
                        Xem sinh viên
                      </Button>
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


