import { Paper, Box, Typography, Avatar } from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
}: StatCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: "24px",
        bgcolor: "#ffffff",
        boxShadow:
          "0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(0,0,0,0.03)",
        transition: "all 0.3s ease-in-out",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.12)",
          "& .icon-bg": {
            transform: "scale(1.2) rotate(-15deg)",
            opacity: 0.15,
          },
        },
      }}
    >
      {/* Background Icon Effect */}
      <Box
        className="icon-bg"
        sx={{
          position: "absolute",
          right: -20,
          bottom: -20,
          color: color,
          opacity: 0.05,
          transform: "rotate(-15deg)",
          transition: "all 0.3s ease-in-out",
          fontSize: "120px",
          pointerEvents: "none",
          zIndex: 0,
          "& svg": {
            fontSize: "120px",
          },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: `${color}15`, // 15% opacity
              color: color,
              width: 56,
              height: 56,
              borderRadius: "16px",
              boxShadow: `0 4px 12px ${color}30`,
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: trendUp ? "#ecfdf5" : "#fef2f2",
                color: trendUp ? "#059669" : "#dc2626",
                px: 1.5,
                py: 0.75,
                borderRadius: "12px",
                border: `1px solid ${trendUp ? "#d1fae5" : "#fee2e2"}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1f2937",
              mb: 0.5,
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#6b7280", fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
