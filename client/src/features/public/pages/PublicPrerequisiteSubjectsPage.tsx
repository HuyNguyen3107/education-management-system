import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { usePublicPrerequisiteSubjects } from "../queries/public-prerequisite-subject.queries";
import { type PrerequisiteSubjectPublic } from "../types/public-prerequisite-subject.types";
import { useEffect, useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

export const PublicPrerequisiteSubjectsPage = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  usePageMeta(
    "Tra cứu môn học tiên quyết",
    "Tra cứu danh sách môn học tiên quyết theo chương trình đào tạo của sinh viên."
  );

  useEffect(() => {
    // Try to get user info from localStorage
    try {
      const userStr = localStorage.getItem("education_client_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          setUserId(user.id);
        }
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
    }
  }, []);

  const { data: subjects, isLoading } = usePublicPrerequisiteSubjects(userId);

  if (isLoading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 3, fontWeight: "bold", color: "#b71c1c" }}
      >
        TRA CỨU MÔN HỌC TIÊN QUYẾT
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderTop: "2px solid #b71c1c" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="prerequisite subjects table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Mã môn đăng ký ▲
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tên môn đăng ký</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mã môn yêu cầu</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Tên môn học yêu cầu
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hệ đào tạo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngành</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Khối</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects?.map((row: PrerequisiteSubjectPublic, index: number) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.registerCode}</TableCell>
                <TableCell>{row.registerName || "Không tìm thấy"}</TableCell>
                <TableCell>{row.prerequisiteCode}</TableCell>
                <TableCell>
                  {row.prerequisiteName || "Không tìm thấy"}
                </TableCell>
                <TableCell>
                  {row.trainingSystem || "Đại học chính quy"}
                </TableCell>
                <TableCell>{row.majorName || ""}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
            {(!subjects || subjects.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
