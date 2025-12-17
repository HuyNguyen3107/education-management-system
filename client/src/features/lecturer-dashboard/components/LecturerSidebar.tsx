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
  Divider,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
  Class as ClassIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_PATHS } from "@/constants/api-path.constants";

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export const LecturerSidebar = ({ open, onToggle }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "Quản lý": true,
    }
  );

  // We can hardcode paths here as they are lecturer specific and might not be in global ROUTE_PATHS yet
  const menuGroups: MenuGroup[] = [
    {
      title: "Trang chủ",
      items: [
        {
          title: "Tổng quan",
          path: "/lecturer", // Assuming base path
          icon: <DashboardIcon />,
        },
      ],
    },
    {
      title: "Giảng dạy",
      items: [
        {
          title: "Lịch dạy",
          path: "/lecturer/schedule",
          icon: <ScheduleIcon />,
        },
        {
          title: "Lớp học phần",
          path: "/lecturer/classes",
          icon: <ClassIcon />,
        },
        {
          title: "Lớp chủ nhiệm",
          path: "/lecturer/admin-classes",
          icon: <GroupsIcon />,
        },
      ],
    },
    {
      title: "Cá nhân",
      items: [
        {
          title: "Thông tin cá nhân",
          path: "/lecturer/profile",
          icon: <PersonIcon />,
        },
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  const isActive = (path: string) => {
    if (path === "/lecturer") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
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
                Giảng viên
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
      <Box
        sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", pt: 2 }}
        className="custom-scrollbar"
      >
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.title}>
            {open && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
                onClick={() => toggleGroup(group.title)}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {group.title}
                </Typography>
                {group.items.length > 1 && (
                  <IconButton
                    size="small"
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      width: 24,
                      height: 24,
                    }}
                  >
                    {expandedGroups[group.title] ? (
                      <ExpandLess fontSize="small" />
                    ) : (
                      <ExpandMore fontSize="small" />
                    )}
                  </IconButton>
                )}
              </Box>
            )}
            <Collapse in={open ? expandedGroups[group.title] : true}>
              <List sx={{ px: 1, pt: 0.5 }}>
                {group.items.map((item) => {
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
                      <Tooltip
                        key={item.path}
                        title={item.title}
                        placement="right"
                      >
                        {MenuItemContent}
                      </Tooltip>
                    );
                  }

                  return <Box key={item.path}>{MenuItemContent}</Box>;
                })}
              </List>
            </Collapse>
            {groupIndex < menuGroups.length - 1 && open && (
              <Divider
                sx={{
                  my: 1.5,
                  mx: 2,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      {open && (
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.75rem",
              display: "block",
              textAlign: "center",
            }}
          >
            © 2025 Education Management System
          </Typography>
        </Box>
      )}
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
