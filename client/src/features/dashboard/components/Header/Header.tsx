import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  InputBase,
  Badge,
  Stack,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { styled, alpha } from "@mui/material/styles";
import { useAuthStore } from "@/store/auth.store";
import { useLogoutMutation } from "@/features/auth/mutations/auth.mutations";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import { useState } from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "16px",
  backgroundColor: alpha("#f3f4f6", 1),
  "&:hover": {
    backgroundColor: alpha("#e5e7eb", 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#9ca3af",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#1f2937",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "300px",
    },
    fontSize: "0.95rem",
  },
}));

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

const drawerWidth = 280;
const drawerWidthCollapsed = 72;

export const Header = ({ onMenuClick, sidebarOpen = true }: HeaderProps) => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate(ROUTE_PATHS.PROFILE);
  };

  const handleLogout = () => {
    handleClose();
    logoutMutation.mutate();
  };

  const userDisplayName = user?.fullName || user?.name || "User";
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
            Tổng quan
          </Typography>
          <Search sx={{ display: { xs: "none", sm: "block" }, ml: 4 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            sx={{
              color: "#6b7280",
              bgcolor: "#f3f4f6",
              "&:hover": { bgcolor: "#e5e7eb" },
            }}
          >
            <Badge badgeContent={4} color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

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
                minWidth: 200,
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
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Thông tin cá nhân
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
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
