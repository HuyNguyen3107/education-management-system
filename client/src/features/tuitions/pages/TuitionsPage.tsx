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
  Menu,
  MenuItem,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  useTuitions,
  useCreateTuition,
  useUpdateTuition,
  useDeleteTuition,
} from "../queries/tuition.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect, useMemo } from "react";
import { TuitionFormDialog } from "../components/TuitionFormDialog";
import { TuitionDeleteDialog } from "../components/TuitionDeleteDialog";
import type { Tuition } from "../types/tuition.types";
import { toast } from "react-toastify";

export const TuitionsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTuition, setSelectedTuition] = useState<Tuition | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tuitionToDelete, setTuitionToDelete] = useState<Tuition | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: tuitions, isLoading } = useTuitions();

  const createTuitionMutation = useCreateTuition();
  const updateTuitionMutation = useUpdateTuition();
  const deleteTuitionMutation = useDeleteTuition();

  // Get unique years and semesters for filters
  const uniqueYears = useMemo(() => {
    if (!tuitions || !Array.isArray(tuitions)) return [];
    return Array.from(new Set(tuitions.map((t) => t.year))).sort().reverse();
  }, [tuitions]);

  const uniqueSemesters = useMemo(() => {
    if (!tuitions || !Array.isArray(tuitions)) return [];
    return Array.from(new Set(tuitions.map((t) => t.semester))).sort();
  }, [tuitions]);

  // Filter tuitions
  const filteredTuitions = useMemo(() => {
    if (!tuitions || !Array.isArray(tuitions)) return [];
    let filtered = tuitions;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.semester.toLowerCase().includes(search) ||
          t.year.toLowerCase().includes(search) ||
          t.academicYear.toLowerCase().includes(search) ||
          t.price.toString().includes(search)
      );
    }

    if (yearFilter) {
      filtered = filtered.filter((t) => t.year === yearFilter);
    }

    if (semesterFilter) {
      filtered = filtered.filter((t) => t.semester === semesterFilter);
    }

    // Sort by year and semester
    return filtered.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year.localeCompare(a.year);
      }
      return b.semester.localeCompare(a.semester);
    });
  }, [tuitions, debouncedSearch, yearFilter, semesterFilter]);

  // Pagination
  const paginatedTuitions = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredTuitions.slice(start, end);
  }, [filteredTuitions, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddTuition = () => {
    setEditingTuition(null);
    setFormOpen(true);
  };

  const handleEditTuition = (tuition: Tuition) => {
    setEditingTuition(tuition);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteTuition = (tuition: Tuition) => {
    setTuitionToDelete(tuition);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!tuitionToDelete) return;

    try {
      setDeleteError(null);
      await deleteTuitionMutation.mutateAsync(tuitionToDelete.id);
      toast.success("Xóa học phí thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa học phí thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: {
    price: number;
    semester: string;
    year: string;
    academicYear: string;
  }) => {
    try {
      if (editingTuition) {
        await updateTuitionMutation.mutateAsync({ id: editingTuition.id, data });
        toast.success("Cập nhật học phí thành công");
      } else {
        await createTuitionMutation.mutateAsync(data);
        toast.success("Thêm mới học phí thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    tuition: Tuition
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTuition(tuition);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTuition(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
          >
            Quản lý học phí
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý mức học phí theo học kỳ và năm học.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTuition}
          sx={{
            bgcolor: "primary.main",
            boxShadow:
              "0 4px 6px -1px rgba(183, 28, 28, 0.4), 0 2px 4px -1px rgba(183, 28, 28, 0.2)",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #f3f4f6",
          overflow: "hidden",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
          p: 3,
        }}
      >
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm theo học kỳ, năm, niên khóa..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Năm học</InputLabel>
            <Select
              value={yearFilter}
              label="Năm học"
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Học kỳ</InputLabel>
            <Select
              value={semesterFilter}
              label="Học kỳ"
              onChange={(e) => {
                setSemesterFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueSemesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TableContainer className="custom-scrollbar">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Học kỳ
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Năm học
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Niên khóa
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Học phí
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngày tạo
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#4b5563" }}
                  align="right"
                >
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : paginatedTuitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy học phí nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTuitions.map((tuition) => (
                  <TableRow key={tuition.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {tuition.semester}
                      </Typography>
                    </TableCell>
                    <TableCell>{tuition.year}</TableCell>
                    <TableCell>{tuition.academicYear}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AttachMoneyIcon sx={{ fontSize: 18, color: "success.main" }} />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "success.main" }}
                        >
                          {formatCurrency(tuition.price)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(tuition.createdAt).toLocaleDateString("vi-VN")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, tuition)}
                      >
                        <MoreVertIcon fontSize="small" />
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
          count={filteredTuitions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem
          onClick={() => selectedTuition && handleEditTuition(selectedTuition)}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedTuition && handleDeleteTuition(selectedTuition)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <TuitionFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTuition}
        isLoading={
          createTuitionMutation.isPending || updateTuitionMutation.isPending
        }
      />

      <TuitionDeleteDialog
        open={deleteDialogOpen}
        tuition={tuitionToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteTuitionMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};

