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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
} from "../queries/class.queries";
import { useLecturers } from "../../lecturers/queries/lecturer.queries";
import { useMajors } from "../../majors/queries/major.queries";
import { useSpecializations } from "../../specializations/queries/specialization.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useMemo } from "react";
import { ClassFormDialog } from "../components/ClassFormDialog";
import { ClassDeleteDialog } from "../components/ClassDeleteDialog";
import type { Class, CreateClassRequest } from "../types/class.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

export const ClassesPage = () => {
  usePageMeta("Quản lý lớp học");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: classesData, isLoading, isError } = useClasses();
  const { data: lecturers = [] } = useLecturers();
  const { data: majorsData } = useMajors({ size: 1000 });
  const majors = majorsData?.content || [];
  const { data: specializationsData } = useSpecializations({ size: 1000 });
  const specializations = specializationsData?.content || [];

  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();
  const deleteClassMutation = useDeleteClass();

  // Create lookup maps for display names
  const lecturerMap = useMemo(() => {
    return lecturers.reduce((acc, lecturer) => {
      acc[lecturer.id] = lecturer.teacherCode;
      return acc;
    }, {} as Record<string, string>);
  }, [lecturers]);

  const majorMap = useMemo(() => {
    return majors.reduce((acc, major) => {
      acc[major.id] = major.name;
      return acc;
    }, {} as Record<string, string>);
  }, [majors]);

  const specializationMap = useMemo(() => {
    return specializations.reduce((acc, spec) => {
      acc[spec.id] = spec.name;
      return acc;
    }, {} as Record<string, string>);
  }, [specializations]);

  // Filter classes based on search and filters
  const filteredClasses = useMemo(() => {
    let result = classesData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (cls) =>
          cls.classCode.toLowerCase().includes(searchLower) ||
          lecturerMap[cls.teacherId]?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedMajorId) {
      result = result.filter((cls) => cls.majorId === selectedMajorId);
    }

    if (selectedTeacherId) {
      result = result.filter((cls) => cls.teacherId === selectedTeacherId);
    }

    return result;
  }, [classesData, debouncedSearch, selectedMajorId, selectedTeacherId, lecturerMap]);

  const handleMajorFilterChange = (event: SelectChangeEvent) => {
    setSelectedMajorId(event.target.value);
  };

  const handleTeacherFilterChange = (event: SelectChangeEvent) => {
    setSelectedTeacherId(event.target.value);
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleEditClass = (cls: Class) => {
    setEditingClass(cls);
    setFormOpen(true);
  };

  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateClassRequest) => {
    if (editingClass) {
      updateClassMutation.mutate(
        { id: editingClass.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật lớp học thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createClassMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm lớp học thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
      deleteClassMutation.mutate(classToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa lớp học thành công");
          setDeleteDialogOpen(false);
          setClassToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
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
          Danh sách lớp học
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClass}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm lớp học..."
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
            <InputLabel>Lọc theo giảng viên</InputLabel>
            <Select
              value={selectedTeacherId}
              label="Lọc theo giảng viên"
              onChange={handleTeacherFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {lecturers.map((lecturer) => (
                <MenuItem key={lecturer.id} value={lecturer.id}>
                  {lecturer.teacherCode}
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
                <TableCell>Mã lớp</TableCell>
                <TableCell>Giảng viên</TableCell>
                <TableCell>Ngành học</TableCell>
                <TableCell>Chuyên ngành</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <Chip
                        label={cls.classCode}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {lecturerMap[cls.teacherId] || cls.teacherId}
                    </TableCell>
                    <TableCell>
                      {cls.majorId ? majorMap[cls.majorId] || "-" : "-"}
                    </TableCell>
                    <TableCell>
                      {cls.specializationId
                        ? specializationMap[cls.specializationId] || "-"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(cls.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClass(cls)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(cls)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ClassFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingClass}
        isLoading={
          createClassMutation.isPending || updateClassMutation.isPending
        }
      />

      <ClassDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteClassMutation.isPending}
      />
    </Box>
  );
};

