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
  Chip,
} from "@mui/material";
import {
  usePrerequisiteSubjects,
  useCreatePrerequisiteSubject,
  useUpdatePrerequisiteSubject,
  useDeletePrerequisiteSubject,
} from "../queries/prerequisite-subject.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useEffect, useMemo } from "react";
import { PrerequisiteSubjectFormDialog } from "../components/PrerequisiteSubjectFormDialog";
import { PrerequisiteSubjectDeleteDialog } from "../components/PrerequisiteSubjectDeleteDialog";
import type { PrerequisiteSubject } from "../types/prerequisite-subject.types";
import { toast } from "react-toastify";

export const PrerequisiteSubjectsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [registerCodeFilter, setRegisterCodeFilter] = useState("");
  const [prerequisiteCodeFilter, setPrerequisiteCodeFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingPrerequisiteSubject, setEditingPrerequisiteSubject] =
    useState<PrerequisiteSubject | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPrerequisiteSubject, setSelectedPrerequisiteSubject] =
    useState<PrerequisiteSubject | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prerequisiteSubjectToDelete, setPrerequisiteSubjectToDelete] =
    useState<PrerequisiteSubject | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: prerequisiteSubjects, isLoading } = usePrerequisiteSubjects();

  const createPrerequisiteSubjectMutation = useCreatePrerequisiteSubject();
  const updatePrerequisiteSubjectMutation = useUpdatePrerequisiteSubject();
  const deletePrerequisiteSubjectMutation = useDeletePrerequisiteSubject();

  // Get unique values for filters
  const uniqueRegisterCodes = useMemo(() => {
    if (!prerequisiteSubjects || !Array.isArray(prerequisiteSubjects)) return [];
    return Array.from(
      new Set(prerequisiteSubjects.map((ps) => ps.registerCode))
    ).sort();
  }, [prerequisiteSubjects]);

  const uniquePrerequisiteCodes = useMemo(() => {
    if (!prerequisiteSubjects || !Array.isArray(prerequisiteSubjects)) return [];
    return Array.from(
      new Set(prerequisiteSubjects.map((ps) => ps.prerequisiteCode))
    ).sort();
  }, [prerequisiteSubjects]);

  // Filter prerequisite subjects
  const filteredPrerequisiteSubjects = useMemo(() => {
    if (!prerequisiteSubjects || !Array.isArray(prerequisiteSubjects)) return [];
    let filtered = prerequisiteSubjects;

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (ps) =>
          ps.registerCode.toLowerCase().includes(search) ||
          ps.prerequisiteCode.toLowerCase().includes(search)
      );
    }

    if (registerCodeFilter) {
      filtered = filtered.filter(
        (ps) => ps.registerCode === registerCodeFilter
      );
    }

    if (prerequisiteCodeFilter) {
      filtered = filtered.filter(
        (ps) => ps.prerequisiteCode === prerequisiteCodeFilter
      );
    }

    // Sort by createdAt desc
    return filtered.sort((a, b) => {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [
    prerequisiteSubjects,
    debouncedSearch,
    registerCodeFilter,
    prerequisiteCodeFilter,
  ]);

  // Pagination
  const paginatedPrerequisiteSubjects = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredPrerequisiteSubjects.slice(start, end);
  }, [filteredPrerequisiteSubjects, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddPrerequisiteSubject = () => {
    setEditingPrerequisiteSubject(null);
    setFormOpen(true);
  };

  const handleEditPrerequisiteSubject = (
    prerequisiteSubject: PrerequisiteSubject
  ) => {
    setEditingPrerequisiteSubject(prerequisiteSubject);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeletePrerequisiteSubject = (
    prerequisiteSubject: PrerequisiteSubject
  ) => {
    setPrerequisiteSubjectToDelete(prerequisiteSubject);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!prerequisiteSubjectToDelete) return;

    try {
      setDeleteError(null);
      await deletePrerequisiteSubjectMutation.mutateAsync(
        prerequisiteSubjectToDelete.id
      );
      toast.success("Xóa môn học tiên quyết thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Xóa môn học tiên quyết thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: {
    registerCode: string;
    prerequisiteCode: string;
  }) => {
    try {
      if (editingPrerequisiteSubject) {
        await updatePrerequisiteSubjectMutation.mutateAsync({
          id: editingPrerequisiteSubject.id,
          data,
        });
        toast.success("Cập nhật môn học tiên quyết thành công");
      } else {
        await createPrerequisiteSubjectMutation.mutateAsync(data);
        toast.success("Thêm mới môn học tiên quyết thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    prerequisiteSubject: PrerequisiteSubject
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrerequisiteSubject(prerequisiteSubject);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedPrerequisiteSubject(null);
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
            Quản lý môn học tiên quyết
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Quản lý mối quan hệ tiên quyết giữa các môn học trong hệ thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPrerequisiteSubject}
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
            placeholder="Tìm kiếm theo mã môn đăng ký, mã môn tiên quyết..."
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Mã môn đăng ký</InputLabel>
            <Select
              value={registerCodeFilter}
              label="Mã môn đăng ký"
              onChange={(e) => {
                setRegisterCodeFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniqueRegisterCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Mã môn tiên quyết</InputLabel>
            <Select
              value={prerequisiteCodeFilter}
              label="Mã môn tiên quyết"
              onChange={(e) => {
                setPrerequisiteCodeFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {uniquePrerequisiteCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
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
                  Mã môn đăng ký
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }} align="center">
                  <ArrowForwardIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Mã môn tiên quyết
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
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : paginatedPrerequisiteSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy môn học tiên quyết nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPrerequisiteSubjects.map((prerequisiteSubject) => (
                  <TableRow key={prerequisiteSubject.id} hover>
                    <TableCell>
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
                    </TableCell>
                    <TableCell align="center">
                      <ArrowForwardIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(prerequisiteSubject.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) =>
                          handleMenuClick(e, prerequisiteSubject)
                        }
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
          count={filteredPrerequisiteSubjects.length}
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
          onClick={() =>
            selectedPrerequisiteSubject &&
            handleEditPrerequisiteSubject(selectedPrerequisiteSubject)
          }
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedPrerequisiteSubject &&
            handleDeletePrerequisiteSubject(selectedPrerequisiteSubject)
          }
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <PrerequisiteSubjectFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPrerequisiteSubject}
        isLoading={
          createPrerequisiteSubjectMutation.isPending ||
          updatePrerequisiteSubjectMutation.isPending
        }
      />

      <PrerequisiteSubjectDeleteDialog
        open={deleteDialogOpen}
        prerequisiteSubject={prerequisiteSubjectToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deletePrerequisiteSubjectMutation.isPending}
        error={deleteError}
      />
    </Box>
  );
};

