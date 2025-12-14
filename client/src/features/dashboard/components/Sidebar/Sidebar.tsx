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
  People as PeopleIcon,
  Person as PersonIcon,
  PersonOutline as PersonOutlineIcon,
  Article as ArticleIcon,
  Notifications as NotificationsIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  BookOutlined as BookOutlinedIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Class as ClassIcon,
  CreditScore as CreditScoreIcon,
  MenuBook as MenuBookIcon,
  HowToReg as HowToRegIcon,
  Receipt as ReceiptIcon,
  Assignment as AssignmentIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ROUTE_PATHS } from "@/constants/route-path.constants";

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

export const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      "Quản lý": true,
    }
  );

  const menuGroups: MenuGroup[] = [
    {
      title: "Trang chủ",
      items: [
        {
          title: "Tổng quan",
          path: ROUTE_PATHS.DASHBOARD,
          icon: <DashboardIcon />,
        },
      ],
    },
    {
      title: "Quản lý",
      items: [
        {
          title: "Người dùng",
          path: ROUTE_PATHS.USERS,
          icon: <PeopleIcon />,
        },
        {
          title: "Sinh viên",
          path: ROUTE_PATHS.STUDENTS,
          icon: <PersonIcon />,
        },
        {
          title: "Chương trình đào tạo",
          path: ROUTE_PATHS.TRAINING_PROGRAM,
          icon: <MenuBookIcon />,
        },
        {
          title: "Giảng viên",
          path: ROUTE_PATHS.LECTURERS,
          icon: <PersonOutlineIcon />,
        },
        {
          title: "Ngành học",
          path: ROUTE_PATHS.MAJORS,
          icon: <SchoolIcon />,
        },
        {
          title: "Khoa",
          path: ROUTE_PATHS.DEPARTMENTS,
          icon: <BusinessIcon />,
        },
        {
          title: "Chuyên ngành",
          path: ROUTE_PATHS.SPECIALIZATIONS,
          icon: <CategoryIcon />,
        },
        {
          title: "Lớp học",
          path: ROUTE_PATHS.CLASSES,
          icon: <ClassIcon />,
        },
        {
          title: "Lớp tín chỉ",
          path: ROUTE_PATHS.CREDIT_CLASSES,
          icon: <CreditScoreIcon />,
        },
        {
          title: "ĐK lớp tín chỉ",
          path: ROUTE_PATHS.STUDENT_CREDIT_CLASSES,
          icon: <AssignmentIcon />,
        },
        {
          title: "Môn học",
          path: ROUTE_PATHS.SUBJECTS,
          icon: <MenuBookIcon />,
        },
        {
          title: "Nguyện vọng đăng ký",
          path: ROUTE_PATHS.ASPIRATION_REGISTERS,
          icon: <HowToRegIcon />,
        },
        {
          title: "Tin tức",
          path: ROUTE_PATHS.NEWS,
          icon: <ArticleIcon />,
        },
        {
          title: "Thông báo",
          path: ROUTE_PATHS.NOTIFICATIONS,
          icon: <NotificationsIcon />,
        },
        {
          title: "Học phí",
          path: ROUTE_PATHS.TUITIONS,
          icon: <AttachMoneyIcon />,
        },
        {
          title: "Học phí sinh viên",
          path: ROUTE_PATHS.STUDENT_TUITIONS,
          icon: <ReceiptIcon />,
        },
        {
          title: "Gán ngành/chuyên ngành",
          path: ROUTE_PATHS.STUDENT_MAJORS,
          icon: <SchoolIcon />,
        },
        {
          title: "Thời gian đăng ký",
          path: ROUTE_PATHS.TIME_REGISTERS,
          icon: <ScheduleIcon />,
        },
        {
          title: "Môn học tiên quyết",
          path: ROUTE_PATHS.PREREQUISITE_SUBJECTS,
          icon: <BookOutlinedIcon />,
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
    if (path === ROUTE_PATHS.DASHBOARD) {
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
                        {item.badge && open && (
                          <Box
                            sx={{
                              ml: "auto",
                              bgcolor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: "12px",
                              px: 1,
                              py: 0.25,
                              minWidth: 24,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                              }}
                            >
                              {item.badge}
                            </Typography>
                          </Box>
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
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.4)",
              fontSize: "0.7rem",
              display: "block",
              textAlign: "center",
              mt: 0.5,
            }}
          >
            Version 1.0.0
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

export default Sidebar;
