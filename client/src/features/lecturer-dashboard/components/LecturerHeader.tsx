import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "@/store/auth.store";
import { useLogoutMutation } from "@/features/auth/mutations/auth.mutations";
import { useState } from "react";

interface LecturerHeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

const drawerWidth = 280;
const drawerWidthCollapsed = 72;

export const LecturerHeader = ({
  onMenuClick,
  sidebarOpen = true,
}: LecturerHeaderProps) => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logoutMutation.mutate();
  };

  const userDisplayName =
    (user as any)?.fullName || (user as any)?.name || "Giảng viên";
  const userEmail = user?.email || "";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          sm: `calc(100% - ${
            sidebarOpen ? drawerWidth : drawerWidthCollapsed
          }px)`,
        },
        ml: {
          sm: `${sidebarOpen ? drawerWidth : drawerWidthCollapsed}px`,
        },
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #f3f4f6",
        color: "#333",
        transition: "width 0.3s ease, margin-left 0.3s ease",
      }}
    >
      <Toolbar sx={{ height: 80 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "#111827",
              fontWeight: 600,
              display: { xs: "none", md: "block" },
            }}
          >
            Tổng quan giảng viên
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              p: 0.5,
              borderRadius: "24px",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Avatar
              alt={userDisplayName}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                bgcolor: "primary.main",
              }}
            >
              {userDisplayName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#111827", fontWeight: 600 }}
              >
                {userDisplayName}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                {userEmail}
              </Typography>
            </Box>
          </Stack>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
