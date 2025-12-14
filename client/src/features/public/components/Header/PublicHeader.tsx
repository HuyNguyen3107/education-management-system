import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        backgroundColor: "#B71C1C",
        color: "#fff",
        transition: "width 0.3s ease, margin-left 0.3s ease",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important", px: 2 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={handleClick}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
              NMH
            </Typography>
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                fontWeight: 600,
                lineHeight: 1.2,
                fontSize: "0.9rem",
              }}
            >
              Nguyễn Mạnh Huy
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.75rem",
                display: "block",
              }}
            >
              B21DCVT231
            </Typography>
          </Box>
          <KeyboardArrowDownIcon
            sx={{
              color: "#fff",
              fontSize: 20,
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Thông tin cá nhân</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Cài đặt</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <Typography variant="body2" color="error">
              Đăng xuất
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
