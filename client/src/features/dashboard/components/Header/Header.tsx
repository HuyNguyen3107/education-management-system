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
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, alpha } from "@mui/material/styles";

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
            sx={{
              cursor: "pointer",
              p: 0.5,
              borderRadius: "24px",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Avatar
              alt="Admin User"
              src="/static/images/avatar/1.jpg"
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            />
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#111827", fontWeight: 600 }}
              >
                Admin User
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Quản trị viên
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
