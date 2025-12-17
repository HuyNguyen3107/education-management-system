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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useMemo } from "react";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../queries/role.queries";
import { RoleFormDialog } from "../components/RoleFormDialog";
import { RoleDeleteDialog } from "../components/RoleDeleteDialog";
import type { Role, CreateRoleRequest } from "../types/role.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const RolesPage = () => {
  usePageMeta(
    "Quản lý vai trò",
    "Quản lý các vai trò trong hệ thống, bỏ qua phân quyền chi tiết."
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const {
    data: roles,
    isLoading,
    isError,
  } = useRoles();

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const handleAddRole = () => {
    setEditingRole(null);
    setFormOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateRoleRequest) => {
    if (editingRole) {
      updateRoleMutation.mutate(
        { id: editingRole.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật vai trò thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật"
            );
          },
        }
      );
    } else {
      createRoleMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm vai trò thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Có lỗi xảy ra khi thêm mới"
          );
        },
      });
    }
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
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi xóa vai trò"
        );
      },
    });
  };

  const filteredRoles = useMemo(() => {
    const list = roles || [];
    if (!searchTerm.trim()) return list;
    const keyword = searchTerm.toLowerCase();
    return list.filter((role) => role.name.toLowerCase().includes(keyword));
  }, [roles, searchTerm]);

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
            Quản lý vai trò
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Danh sách các vai trò trong hệ thống. Không cấu hình bảng quyền
            chi tiết.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRole}
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
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo tên vai trò..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        </Box>

        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Tên vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngày tạo
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Ngày cập nhật
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
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="error">
                      Có lỗi xảy ra khi tải danh sách vai trò
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Chưa có vai trò nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600 }}
                      >
                        {role.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {role.updatedAt
                        ? new Date(role.updatedAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditRole(role)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(role)}
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

      <RoleFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingRole}
        isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
      />

      <RoleDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteRoleMutation.isPending}
        roleName={roleToDelete?.name}
      />
    </Box>
  );
};


