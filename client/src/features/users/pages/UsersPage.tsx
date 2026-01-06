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
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useGetAllRoles,
  useGetAllUserRoles,
  useAddRoleToUser,
} from "../queries/user.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect, useMemo } from "react";
import { UserFormDialog } from "../components/UserFormDialog";
import { UserDeleteDialog } from "../components/UserDeleteDialog";
import { UserRoleDialog } from "../components/UserRoleDialog";
import type {
  User,
  CreateUserRequest,
  Role,
  UserRole,
} from "../types/user.types";
import { SUPER_ADMIN_EMAIL } from "../constants/super-admin.constants";
import { toast } from "react-toastify";
import {
  ALL_STATUSES,
  getStatusColor,
  getStatusLabel,
} from "../constants/user-status.constants";
import { usePageMeta } from "@/hooks/usePageMeta";

export const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  usePageMeta(
    "Quản lý người dùng",
    "Quản lý tài khoản người dùng trong hệ thống quản lý đào tạo."
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: usersData,
    isLoading,
    isError,
  } = useUsers({
    page,
    size: rowsPerPage,
    search: debouncedSearch,
    status: statusFilter || undefined,
    sort: "createdAt,desc",
  });

  const { data: allRoles } = useGetAllRoles();
  const { data: allUserRoles } = useGetAllUserRoles();

  const userRoleNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!allUserRoles || !allRoles) return map;

    allUserRoles.forEach((ur: UserRole) => {
      const role = allRoles.find((r: Role) => r.id === ur.roleId);
      if (role?.name) {
        map[ur.userId] = role.name;
      } else if (ur.roleName) {
        map[ur.userId] = ur.roleName;
      }
    });

    return map;
  }, [allUserRoles, allRoles]);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const addRoleToUserMutation = useAddRoleToUser();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddUser = () => {
    // Không cho tạo thêm user với email super admin
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteUser = (user: User) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error("Không thể xóa tài khoản super admin");
      return;
    }
    setUserToDelete(user);
    setDeleteError(null);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleAssignRoles = (user: User) => {
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error(
        "Tài khoản super admin luôn là ADMIN và không thể thay đổi vai trò"
      );
      return;
    }
    setSelectedUser(user);
    setRoleDialogOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteError(null);
      await deleteUserMutation.mutateAsync(userToDelete.id);
      toast.success("Xóa người dùng thành công");
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa người dùng thất bại";
      setDeleteError(msg);
    }
  };

  const handleFormSubmit = async (data: CreateUserRequest) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, data });
        toast.success("Cập nhật người dùng thành công");
      } else {
        // Create user first
        const newUser = await createUserMutation.mutateAsync(data);

        // Assign role if roleId is provided
        if (data.roleId && newUser?.id) {
          await addRoleToUserMutation.mutateAsync({
            userId: newUser.id,
            roleId: data.roleId,
          });
        }

        toast.success("Thêm mới người dùng thành công");
      }
      setFormOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (isError) {
    return (
      <Typography color="error">
        Không thể tải danh sách người dùng. Vui lòng thử lại sau.
      </Typography>
    );
  }

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
            Quản lý người dùng
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Danh sách tất cả người dùng trong hệ thống.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
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
            placeholder="Tìm kiếm theo tên hoặc email..."
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                borderRadius: "12px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {ALL_STATUSES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
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
                  Họ và tên
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Số điện thoại
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Giới tính
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Vai trò
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#4b5563" }}>
                  Trạng thái
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
              ) : usersData?.content?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      Không tìm thấy người dùng nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                usersData?.content?.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.fullName}
                        {user.email === SUPER_ADMIN_EMAIL && (
                          <Chip
                            label="Super Admin"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{userRoleNameMap[user.id] || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(user.status)}
                        size="small"
                        color={getStatusColor(user.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
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
          count={usersData?.totalElements || 0}
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
          onClick={() => selectedUser && handleAssignRoles(selectedUser)}
          disabled={selectedUser?.email === SUPER_ADMIN_EMAIL}
        >
          <SecurityIcon fontSize="small" sx={{ mr: 1 }} /> Gán vai trò
        </MenuItem>
        <MenuItem
          onClick={() => selectedUser && handleEditUser(selectedUser)}
          disabled={selectedUser?.email === SUPER_ADMIN_EMAIL}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Chỉnh sửa
        </MenuItem>
        <MenuItem
          onClick={() => selectedUser && handleDeleteUser(selectedUser)}
          sx={{ color: "error.main" }}
          disabled={selectedUser?.email === SUPER_ADMIN_EMAIL}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>

      <UserFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      <UserDeleteDialog
        open={deleteDialogOpen}
        user={userToDelete}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteUserMutation.isPending}
        error={deleteError}
      />

      <UserRoleDialog
        open={roleDialogOpen}
        userId={selectedUser?.id ?? null}
        onClose={() => {
          setRoleDialogOpen(false);
          setSelectedUser(null);
        }}
      />
    </Box>
  );
};
