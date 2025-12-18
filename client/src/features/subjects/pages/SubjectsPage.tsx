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
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from "../queries/subject.queries";
import { useMajors } from "../../majors/queries/major.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect, useMemo } from "react";
import { SubjectFormDialog } from "../components/SubjectFormDialog";
import { SubjectDeleteDialog } from "../components/SubjectDeleteDialog";
import { SubjectDetailDialog } from "../components/SubjectDetailDialog";
import type { Subject, CreateSubjectRequest } from "../types/subject.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const SubjectsPage = () => {
  usePageMeta("Quản lý môn học");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: subjectsData, isLoading, isError } = useSubjects();
  const { data: majorsData } = useMajors({ size: 1000 });
  const majors = majorsData?.content || [];
  // const { data: specializationsData } = useSpecializations({ size: 1000 });
  // const specializations = specializationsData?.content || [];

  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  // Create lookup maps
  const majorMap = useMemo(() => {
    return majors.reduce((acc, major) => {
      acc[major.id] = major.name;
      return acc;
    }, {} as Record<string, string>);
  }, [majors]);

  // const specializationMap = useMemo(() => {
  //   return specializations.reduce(
  //     (acc: { [x: string]: any }, spec: { id: string | number; name: any }) => {
  //       acc[spec.id] = spec.name;
  //       return acc;
  //     },
  //     {} as Record<string, string>
  //   );
  // }, [specializations]);

  // Get unique semesters for filter
  const semesters = useMemo(() => {
    const semesterSet = new Set<string>();
    subjectsData?.forEach((subject) => {
      if (subject.semester) semesterSet.add(subject.semester);
    });
    return Array.from(semesterSet).sort();
  }, [subjectsData]);

  // Filter subjects
  const filteredSubjects = useMemo(() => {
    let result = subjectsData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchLower) ||
          subject.subjectCode.toLowerCase().includes(searchLower)
      );
    }

    if (selectedMajorId) {
      result = result.filter((subject) => subject.majorId === selectedMajorId);
    }

    if (selectedSemester) {
      result = result.filter(
        (subject) => subject.semester === selectedSemester
      );
    }

    return result;
  }, [subjectsData, debouncedSearch, selectedMajorId, selectedSemester]);

  const handleMajorFilterChange = (event: SelectChangeEvent) => {
    setSelectedMajorId(event.target.value);
  };

  const handleSemesterFilterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (subject: Subject) => {
    setSelectedSubject(subject);
    setDetailDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateSubjectRequest) => {
    if (editingSubject) {
      updateSubjectMutation.mutate(
        { id: editingSubject.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật môn học thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createSubjectMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm môn học thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteSubjectMutation.mutate(subjectToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa môn học thành công");
          setDeleteDialogOpen(false);
          setSubjectToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  // Calculate total periods for a subject
  const getTotalPeriods = (ingredients: Subject["ingredientSecretion"]) => {
    // Backend data may sometimes send this as null or a non-array value
    if (!Array.isArray(ingredients) || ingredients.length === 0) return 0;
    return ingredients.reduce((sum, item) => sum + (item?.periods ?? 0), 0);
  };

  // Format ingredient secretion for display
  const formatIngredientSecretion = (
    ingredients: Subject["ingredientSecretion"]
  ) => {
    if (!Array.isArray(ingredients) || ingredients.length === 0)
      return "Chưa có";
    const nonZero = ingredients.filter((i) => (i?.periods ?? 0) > 0);
    if (nonZero.length === 0) return "Chưa có";
    return nonZero.map((i) => `${i?.name}: ${i?.periods ?? 0}`).join(", ");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Danh sách môn học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSubject}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm môn học..."
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Lọc theo ngành</InputLabel>
            <Select
              value={selectedMajorId}
              label="Lọc theo ngành"
              onChange={handleMajorFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {majors.map((major) => (
                <MenuItem key={major.id} value={major.id}>
                  {major.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Lọc theo học kỳ</InputLabel>
            <Select
              value={selectedSemester}
              label="Lọc theo học kỳ"
              onChange={handleSemesterFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {semesters.map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper>
        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã môn học</TableCell>
                <TableCell>Tên môn học</TableCell>
                <TableCell>Ngành</TableCell>
                <TableCell align="center">Số tín chỉ</TableCell>
                <TableCell align="center">Tổng số tiết</TableCell>
                <TableCell>Tiết thành phần</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>
                      <Chip
                        label={subject.subjectCode}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{subject.name}</Typography>
                    </TableCell>
                    <TableCell>
                      {subject.majorId ? majorMap[subject.majorId] || "-" : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {subject.numberOfCredit ? (
                        <Chip
                          label={subject.numberOfCredit}
                          color="info"
                          size="small"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getTotalPeriods(subject.ingredientSecretion)}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Nhấn để xem chi tiết">
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleViewDetail(subject)}
                          sx={{
                            textTransform: "none",
                            color: "#6b7280",
                            "&:hover": { color: "#3b82f6" },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 180,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatIngredientSecretion(
                              subject.ingredientSecretion
                            )}
                          </Typography>
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subject.semester}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetail(subject)}
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditSubject(subject)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(subject)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SubjectFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSubject}
        isLoading={
          createSubjectMutation.isPending || updateSubjectMutation.isPending
        }
      />

      <SubjectDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteSubjectMutation.isPending}
      />

      <SubjectDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        subject={selectedSubject}
      />
    </Box>
  );
};
