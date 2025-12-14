import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

interface PublicSidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    title: "Trang chủ",
    path: ROUTE_PATHS.PUBLIC_HOME,
    icon: <HomeIcon />,
  },
  {
    title: "Tin tức",
    path: ROUTE_PATHS.PUBLIC_HOME, // Will filter to show news
    icon: <ArticleIcon />,
  },
];

export const PublicSidebar = ({ open, onToggle }: PublicSidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(180deg, #B71C1C 0%, #8B0000 100%)",
        color: "#fff",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2.5,
          minHeight: 72,
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            >
              <SchoolIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                }}
              >
                EMS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                Education System
              </Typography>
            </Box>
          </Box>
        )}
        {!open && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <SchoolIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
        )}
        {open && (
          <IconButton
            onClick={onToggle}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
              width: 36,
              height: 36,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", pt: 2 }} className="custom-scrollbar">
        <List sx={{ px: 1, pt: 0.5 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const MenuItemContent = (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: "12px",
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2.5 : 1.5,
                    py: 1.25,
                    bgcolor: active
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                    position: "relative",
                    "&::before": active
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 4,
                          height: "60%",
                          bgcolor: "#fff",
                          borderRadius: "0 4px 4px 0",
                        }
                      : {},
                    "&:hover": {
                      bgcolor: active
                        ? "rgba(255, 255, 255, 0.25)"
                        : "rgba(255, 255, 255, 0.1)",
                      transform: "translateX(2px)",
                      transition: "all 0.2s ease",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: active ? "#fff" : "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: active ? 600 : 500,
                          fontSize: "0.9rem",
                          color: "#fff",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );

            if (!open) {
              return (
                <Tooltip key={item.path} title={item.title} placement="right">
                  {MenuItemContent}
                </Tooltip>
              );
            }

            return <Box key={item.path}>{MenuItemContent}</Box>;
          })}
        </List>
      </Box>
    </Box>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          boxSizing: "border-box",
          border: "none",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

