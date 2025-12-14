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
  IconButton,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import {
  useMajors,
  useCreateMajor,
  useUpdateMajor,
  useDeleteMajor,
} from "../queries/major.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { MajorFormDialog } from "../components/MajorFormDialog";
import { MajorDeleteDialog } from "../components/MajorDeleteDialog";
import type { Major, CreateMajorRequest } from "../types/major.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const MajorsPage = () => {
  usePageMeta("Quản lý ngành học");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState<Major | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: majorsData,
    isLoading,
    isError,
  } = useMajors({
    page,
    size: rowsPerPage,
    keyword: debouncedSearch,
  });

  const createMajorMutation = useCreateMajor();
  const updateMajorMutation = useUpdateMajor();
  const deleteMajorMutation = useDeleteMajor();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddMajor = () => {
    setEditingMajor(null);
    setFormOpen(true);
  };

  const handleEditMajor = (major: Major) => {
    setEditingMajor(major);
    setFormOpen(true);
  };

  const handleDeleteClick = (major: Major) => {
    setMajorToDelete(major);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateMajorRequest) => {
    if (editingMajor) {
      updateMajorMutation.mutate(
        { id: editingMajor.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật ngành học thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createMajorMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm ngành học thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (majorToDelete) {
      deleteMajorMutation.mutate(majorToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa ngành học thành công");
          setDeleteDialogOpen(false);
          setMajorToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Quản lý ngành học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMajor}
        >
          Thêm ngành
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm ngành học..."
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
      </Paper>

      <Paper>
        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên ngành</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày cập nhật</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "error.main" }}>
                    Có lỗi xảy ra khi tải dữ liệu
                  </TableCell>
                </TableRow>
              ) : (!majorsData?.content || majorsData.content.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                majorsData?.content?.map((major, index) => (
                  <TableRow key={major.id}>
                    <TableCell>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{major.name}</TableCell>
                    <TableCell>
                      {new Date(major.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      {new Date(major.updatedAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditMajor(major)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(major)}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={majorsData?.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Paper>

      <MajorFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMajor}
        isLoading={createMajorMutation.isPending || updateMajorMutation.isPending}
      />

      <MajorDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMajorMutation.isPending}
      />
    </Box>
  );
};
