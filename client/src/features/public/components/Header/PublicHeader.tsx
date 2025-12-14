import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  InputBase,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

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

interface PublicHeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

const drawerWidth = 280;
const drawerWidthCollapsed = 72;

export const PublicHeader = ({
  onMenuClick,
  sidebarOpen = true,
}: PublicHeaderProps) => {
  const navigate = useNavigate();

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
            onClick={() => navigate(ROUTE_PATHS.PUBLIC_HOME)}
            sx={{
              color: "#111827",
              fontWeight: 600,
              display: { xs: "none", md: "block" },
              cursor: "pointer",
              "&:hover": {
                color: "#B71C1C",
              },
            }}
          >
            Trang chủ
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
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              cursor: "pointer",
              "&:hover": {
                color: "#111827",
              },
              display: { xs: "none", sm: "block" },
            }}
            onClick={() => navigate(ROUTE_PATHS.LOGIN)}
          >
            Đăng nhập
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
