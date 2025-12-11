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
  useSpecializations,
  useCreateSpecialization,
  useUpdateSpecialization,
  useDeleteSpecialization,
} from "../queries/specialization.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { SpecializationFormDialog } from "../components/SpecializationFormDialog";
import { SpecializationDeleteDialog } from "../components/SpecializationDeleteDialog";
import type {
  Specialization,
  CreateSpecializationRequest,
} from "../types/specialization.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const SpecializationsPage = () => {
  usePageMeta("Quản lý chuyên ngành");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSpecialization, setEditingSpecialization] =
    useState<Specialization | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] =
    useState<Specialization | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: specializationsData,
    isLoading,
    isError,
  } = useSpecializations({
    page,
    size: rowsPerPage,
    keyword: debouncedSearch,
  });

  const createSpecializationMutation = useCreateSpecialization();
  const updateSpecializationMutation = useUpdateSpecialization();
  const deleteSpecializationMutation = useDeleteSpecialization();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddSpecialization = () => {
    setEditingSpecialization(null);
    setFormOpen(true);
  };

  const handleEditSpecialization = (specialization: Specialization) => {
    setEditingSpecialization(specialization);
    setFormOpen(true);
  };

  const handleDeleteClick = (specialization: Specialization) => {
    setSpecializationToDelete(specialization);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateSpecializationRequest) => {
    if (editingSpecialization) {
      updateSpecializationMutation.mutate(
        { id: editingSpecialization.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật chuyên ngành thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createSpecializationMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm mới chuyên ngành thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (specializationToDelete) {
      deleteSpecializationMutation.mutate(specializationToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa chuyên ngành thành công");
          setDeleteDialogOpen(false);
          setSpecializationToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quản lý chuyên ngành
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSpecialization}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm chuyên ngành..."
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

        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên chuyên ngành</TableCell>
                <TableCell>Ngành học</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : specializationsData?.content?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                specializationsData?.content?.map(
                  (specialization: Specialization) => (
                    <TableRow key={specialization.id}>
                      <TableCell>{specialization.name}</TableCell>
                      <TableCell>{specialization.majorName}</TableCell>
                      <TableCell>
                        {new Date(specialization.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleEditSpecialization(specialization)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(specialization)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={specializationsData?.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </Paper>

      <SpecializationFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSpecialization}
        isLoading={
          createSpecializationMutation.isPending ||
          updateSpecializationMutation.isPending
        }
      />

      <SpecializationDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSpecializationMutation.isPending}
      />
    </Box>
  );
};
