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
import { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  useDeleteMgmtRole,
  useMgmtRoles,
} from "../queries/role-permission.queries";
import type { Role } from "@/features/users/types/user.types";
import { RoleFormDialog } from "../components/RoleFormDialog";
import { RoleDeleteDialog } from "../components/RoleDeleteDialog";
import { useAuthStore } from "@/store/auth.store";

export const RolePermissionManagementPage = () => {
  usePageMeta(
    "Quản lý vai trò & quyền hạn",
    "Quản lý danh sách vai trò và gán quyền hạn cho từng vai trò trong hệ thống."
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canViewRoles =
    hasPermission("ROLE_VIEW") ||
    hasPermission("ROLE_PERMISSION_VIEW") ||
    hasPermission("PERMISSION_VIEW");
  const canCreateRole = hasPermission("ROLE_CREATE");
  const canUpdateRole = hasPermission("ROLE_UPDATE");
  const canDeleteRole = hasPermission("ROLE_DELETE");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: roles = [],
    isLoading,
    isError,
  } = useMgmtRoles(canViewRoles);

  const deleteRoleMutation = useDeleteMgmtRole();

  const filteredRoles = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();
    if (!keyword) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(keyword)
    );
  }, [roles, debouncedSearch]);

  const paginatedRoles = useMemo(
    () =>
      filteredRoles.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRoles, page, rowsPerPage]
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRole = () => {
    if (!canCreateRole) {
      toast.error("Bạn không có quyền tạo vai trò");
      return;
    }
    setEditingRole(null);
    setFormOpen(true);
  };

  const handleEditRole = (role: Role) => {
    if (!canUpdateRole) {
      toast.error("Bạn không có quyền cập nhật vai trò");
      return;
    }
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    if (!canDeleteRole) {
      toast.error("Bạn không có quyền xóa vai trò");
      return;
    }
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) return;

    deleteRoleMutation.mutate(roleToDelete.id, {
      onSuccess: () => {
        toast.success("Xóa vai trò thành công");
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Không thể xóa vai trò";
        toast.error(msg);
      },
    });
  };

  const totalElements = filteredRoles.length;

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
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}
          >
            Quản lý vai trò &amp; quyền hạn
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Danh sách vai trò trong hệ thống và các quyền được gán cho từng vai trò.
          </Typography>
        </Box>

        {canCreateRole && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRole}
          >
            Thêm vai trò
          </Button>
        )}
      </Box>

      {canViewRoles ? (
        <>
          <Paper
            sx={{
              mb: 3,
              p: 2,
              borderRadius: "20px",
              border: "1px solid #f3f4f6",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                placeholder="Tìm kiếm theo tên vai trò..."
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>

          <Paper
            sx={{
              borderRadius: "20px",
              border: "1px solid #f3f4f6",
              overflow: "hidden",
            }}
          >
        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Tên vai trò
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: "#4b5563" }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <Typography color="error">
                      Có lỗi xảy ra khi tải danh sách vai trò
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy vai trò nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.name}</TableCell>
                    <TableCell align="right">
                      {canUpdateRole && (
                        <IconButton
                          color="primary"
                          onClick={() => handleEditRole(role)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canDeleteRole && (
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(role)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
          </Paper>
        </>
      ) : (
        <Paper
          sx={{
            mt: 2,
            p: 3,
            borderRadius: "20px",
            border: "1px dashed #e5e7eb",
          }}
        >
          <Typography color="text.secondary">
            Bạn không có quyền xem danh sách vai trò.
          </Typography>
        </Paper>
      )}

      {canCreateRole || canUpdateRole ? (
        <RoleFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initialRole={editingRole}
          onSaved={() => {
            // Nếu đang ở trang > 0 nhưng số lượng bản ghi ít đi, có thể cần reset trang,
            // tuy nhiên react-query sẽ tự làm mới dữ liệu nên ở đây chỉ để hook nếu cần.
          }}
        />
      ) : null}

      {canDeleteRole && (
        <RoleDeleteDialog
          open={deleteDialogOpen}
          role={roleToDelete}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={deleteRoleMutation.isPending}
        />
      )}
    </Box>
  );
};

