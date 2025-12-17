import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useStudentTuitionDetails } from "../queries/student-tuition.queries";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export const StudentTuitionViewingPage = () => {
  usePageMeta("Xem học phí");
  const { user } = useAuthStore();
  const studentId = user?.id || "";

  const [selectedSemester, setSelectedSemester] = useState("all");

  const {
    data: tuitionData,
    isLoading,
    isError,
  } = useStudentTuitionDetails(studentId);

  // Group data by Type (Thu Học Phí vs Thu Học Lại) and then by Semester
  // However, the UI shows groups like "Thu Học Lại" and "Thu Học Phí".
  // The API returns a list with "type" field.
  // We need to group by this "type".

  const groupedData = useMemo(() => {
    if (!tuitionData) return {};

    // Filter first if needed
    let filtered = tuitionData;
    if (selectedSemester !== "all") {
      filtered = tuitionData.filter(
        (item: any) => item.termName === selectedSemester
      );
    }

    // Group by Type
    const groups: Record<string, any[]> = {};
    filtered.forEach((item: any) => {
      const type = item.type || "Thu Học Phí"; // Default
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    });

    return groups;
  }, [tuitionData, selectedSemester]);

  // Get unique semesters for filter
  const semesters = useMemo(() => {
    if (!tuitionData) return [];
    const set = new Set<string>();
    tuitionData.forEach((item: any) => set.add(item.termName));
    return Array.from(set);
  }, [tuitionData]);

  // Calculate Totals
  const calculateTotals = (items: any[]) => {
    return items.reduce(
      (acc, item) => ({
        price: acc.price + (item.price || 0),
        endow: acc.endow + (item.endow || 0),
        required: acc.required + (item.required || 0),
        paid: acc.paid + (item.paid || 0),
        debt: acc.debt + (item.debt || 0),
      }),
      { price: 0, endow: 0, required: 0, paid: 0, debt: 0 }
    );
  };

  const grandTotal = useMemo(() => {
    if (!tuitionData)
      return { price: 0, endow: 0, required: 0, paid: 0, debt: 0 };
    // Use the filtered list if filter is applied?
    // Usually "Grand Total" reflects the visible rows.
    const itemsToSum =
      selectedSemester !== "all"
        ? tuitionData.filter((item: any) => item.termName === selectedSemester)
        : tuitionData;
    return calculateTotals(itemsToSum);
  }, [tuitionData, selectedSemester]);

  if (!studentId) return <Alert severity="error">Vui lòng đăng nhập</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <Select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            displayEmpty
          >
            <MenuItem value="all">Tổng hợp học phí tất cả học kỳ</MenuItem>
            {semesters.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Niên học học kỳ</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                HP chưa giảm
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Miễn giảm
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Phải thu
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Đã thu
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Còn nợ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Có lỗi xảy ra
                </TableCell>
              </TableRow>
            ) : (
              <>
                {Object.entries(groupedData).map(([type, items]) => {
                  const groupTotal = calculateTotals(items);
                  return (
                    <>
                      {/* Group Header */}
                      <TableRow sx={{ bgcolor: "#e0e0e0" }}>
                        <TableCell colSpan={7} sx={{ fontWeight: "bold" }}>
                          {type}
                        </TableCell>
                      </TableRow>

                      {/* Items */}
                      {items.map((item: any, index: number) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.termName}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.endow)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.required)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.paid)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.debt)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Group Total */}
                      <TableRow sx={{ bgcolor: "#fff3e0" }}>
                        <TableCell
                          colSpan={2}
                          align="center"
                          sx={{ fontWeight: "bold" }}
                        >
                          TỔNG
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(groupTotal.price)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(groupTotal.endow)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(groupTotal.required)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(groupTotal.paid)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {formatCurrency(groupTotal.debt)}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}

                {/* Grand Total */}
                <TableRow sx={{ bgcolor: "#fbe9e7" }}>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    TỔNG CỘNG
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {formatCurrency(grandTotal.price)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {formatCurrency(grandTotal.endow)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {formatCurrency(grandTotal.required)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {formatCurrency(grandTotal.paid)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: "bold", color: "#d32f2f" }}
                  >
                    {formatCurrency(grandTotal.debt)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
