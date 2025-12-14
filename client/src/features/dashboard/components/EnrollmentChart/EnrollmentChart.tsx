import { Paper, Box, Typography, Button } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const data = [
  { name: "Thứ 2", students: 40 },
  { name: "Thứ 3", students: 30 },
  { name: "Thứ 4", students: 20 },
  { name: "Thứ 5", students: 27 },
  { name: "Thứ 6", students: 18 },
  { name: "Thứ 7", students: 23 },
  { name: "CN", students: 34 },
];

export const EnrollmentChart = () => {
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
          Đăng ký mới
        </Typography>
        <Button
          sx={{
            minWidth: "auto",
            p: 1,
            borderRadius: "50%",
            color: "#9ca3af",
            "&:hover": { bgcolor: "#f3f4f6", color: "#111827" },
          }}
        >
          <MoreHorizIcon />
        </Button>
      </Box>

      <Box sx={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="students" radius={[6, 6, 6, 6]} barSize={20}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "#8b5cf6" : "#c4b5fd"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
