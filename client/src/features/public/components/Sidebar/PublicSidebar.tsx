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
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Campaign as CampaignIcon,
  MenuBook as MenuBookIcon,
  Subject as SubjectIcon,
  Assignment as AssignmentIcon,
  HowToReg as HowToRegIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CalendarToday as CalendarTodayIcon,
  EventNote as EventNoteIcon,
  Grade as GradeIcon,
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
    title: "Thông báo từ ban quản trị",
    path: ROUTE_PATHS.PUBLIC_ADMIN_NOTIFICATIONS,
    icon: <CampaignIcon />,
  },
  {
    title: "Xem chương trình đào tạo",
    path: ROUTE_PATHS.PUBLIC_TRAINING_PROGRAM,
    icon: <MenuBookIcon />,
  },
  {
    title: "Xem môn học tiên quyết",
    path: ROUTE_PATHS.PUBLIC_PREREQUISITE_SUBJECTS,
    icon: <SubjectIcon />,
  },
  {
    title: "Đăng ký môn học",
    path: ROUTE_PATHS.PUBLIC_SUBJECT_REGISTRATION,
    icon: <AssignmentIcon />,
  },
  {
    title: "Đăng ký môn nguyện vọng",
    path: ROUTE_PATHS.PUBLIC_WISHLIST_REGISTRATION,
    icon: <HowToRegIcon />,
  },
  {
    title: "Xem học phí",
    path: ROUTE_PATHS.PUBLIC_TUITION_VIEWING,
    icon: <AccountBalanceWalletIcon />,
  },
  {
    title: "Thời khóa biểu dạng tuần",
    path: ROUTE_PATHS.PUBLIC_WEEKLY_SCHEDULE,
    icon: <CalendarTodayIcon />,
  },
  {
    title: "Xem lịch thi",
    path: ROUTE_PATHS.PUBLIC_EXAM_SCHEDULE,
    icon: <EventNoteIcon />,
  },
  {
    title: "Xem điểm",
    path: ROUTE_PATHS.PUBLIC_GRADE_VIEWING,
    icon: <GradeIcon />,
  },
];

export const PublicSidebar = ({ open, onToggle }: PublicSidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
    if (isMobile) {
      onToggle();
    }
  };

  const isActive = (path: string) => {
    // For home page, check if pathname starts with /public/home (but not admin-notifications)
    if (path === ROUTE_PATHS.PUBLIC_HOME) {
      return (
        location.pathname === "/public/home" ||
        location.pathname === "/public/home/" ||
        (location.pathname.startsWith("/public/home") &&
          !location.pathname.includes("/admin-notifications") &&
          !location.pathname.includes("/notification/"))
      );
    }
    // For admin notifications, check exact match or starts with
    if (path === ROUTE_PATHS.PUBLIC_ADMIN_NOTIFICATIONS) {
      return (
        location.pathname.startsWith("/public/home/admin-notifications") ||
        location.pathname.includes("/home/notification/")
      );
    }
    return location.pathname === path;
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
        color: "#333",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 2,
          minHeight: 64,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                background: "#B71C1C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  fontSize: "1rem",
                  lineHeight: 1.2,
                }}
              >
                EMS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
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
              borderRadius: "8px",
              background: "#B71C1C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
        )}
        {open && (
          <IconButton
            onClick={onToggle}
            sx={{
              color: "#6b7280",
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
              width: 32,
              height: 32,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          pt: 1,
        }}
        className="custom-scrollbar"
      >
        <List sx={{ px: 1, pt: 0 }}>
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            const uniqueKey = `${item.title}-${index}`;
            const MenuItemContent = (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: "8px",
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 2 : 1.5,
                    py: 1,
                    bgcolor: active ? "#B71C1C" : "transparent",
                    color: active ? "#fff" : "#374151",
                    "&:hover": {
                      bgcolor: active ? "#8B0000" : "#f3f4f6",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: active ? "#fff" : "#6b7280",
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
                          fontSize: "0.875rem",
                          color: active ? "#fff" : "#374151",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );

            if (!open) {
              return (
                <Tooltip key={uniqueKey} title={item.title} placement="right">
                  {MenuItemContent}
                </Tooltip>
              );
            }

            return <Box key={uniqueKey}>{MenuItemContent}</Box>;
          })}
        </List>
      </Box>

      {/* Footer */}
      {open && (
        <Box
          sx={{
            borderTop: "1px solid #e5e7eb",
            p: 2,
            bgcolor: "#f9fafb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <SchoolIcon sx={{ color: "#B71C1C", fontSize: 32 }} />
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "0.7rem",
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            HỆ THỐNG QUẢN LÝ ĐÀO TẠO
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: "0.65rem",
              lineHeight: 1.4,
            }}
          >
            CỔNG THÔNG TIN QUẢN LÝ ĐÀO TẠO
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
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
