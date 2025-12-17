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
  useCreditClasses,
  useCreateCreditClass,
  useUpdateCreditClass,
  useDeleteCreditClass,
} from "../queries/credit-class.queries";
import { useLecturers } from "../../lecturers/queries/lecturer.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState, useEffect, useMemo } from "react";
import { CreditClassFormDialog } from "../components/CreditClassFormDialog";
import { CreditClassDeleteDialog } from "../components/CreditClassDeleteDialog";
import { CreditClassDetailDialog } from "../components/CreditClassDetailDialog";
import { ScheduleItemDetailDialog } from "../components/ScheduleItemDetailDialog";
import type {
  CreditClass,
  CreateCreditClassRequest,
  ScheduleItem,
} from "../types/credit-class.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

// Days of week mapping
const DAY_SHORT_LABELS: Record<string, string> = {
  "2": "T2",
  "3": "T3",
  "4": "T4",
  "5": "T5",
  "6": "T6",
  "7": "T7",
  CN: "CN",
  "0": "CN",
};

// Format schedule for table display
const formatScheduleDisplay = (schedule: ScheduleItem[]) => {
  if (!schedule || schedule.length === 0) return "-";
  return schedule
    .map(
      (item) =>
        `${DAY_SHORT_LABELS[item.dayOfWeek] || item.dayOfWeek}, T${
          item.startPeriod
        }-${item.startPeriod + item.numberOfPeriods - 1}`
    )
    .join("; ");
};

export const CreditClassesPage = () => {
  usePageMeta("Quản lý lớp tín chỉ");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCreditClass, setEditingCreditClass] =
    useState<CreditClass | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creditClassToDelete, setCreditClassToDelete] =
    useState<CreditClass | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] =
    useState<CreditClass | null>(null);

  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedScheduleItems, setSelectedScheduleItems] = useState<
    ScheduleItem[]
  >([]);
  const [selectedCreditClassName, setSelectedCreditClassName] =
    useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: creditClassesData, isLoading, isError } = useCreditClasses();
  const { data: lecturers = [] } = useLecturers();

  const createCreditClassMutation = useCreateCreditClass();
  const updateCreditClassMutation = useUpdateCreditClass();
  const deleteCreditClassMutation = useDeleteCreditClass();

  // Create lookup map for lecturer names
  const lecturerMap = useMemo(() => {
    return lecturers.reduce((acc, lecturer) => {
      acc[lecturer.id] = lecturer.teacherCode;
      return acc;
    }, {} as Record<string, string>);
  }, [lecturers]);

  // Get unique semesters for filter
  const semesters = useMemo(() => {
    const semesterSet = new Set<string>();
    creditClassesData?.forEach((cc) => {
      if (cc.semester) semesterSet.add(cc.semester);
    });
    return Array.from(semesterSet).sort();
  }, [creditClassesData]);

  // Filter credit classes
  const filteredCreditClasses = useMemo(() => {
    let result = creditClassesData || [];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (cc) =>
          cc.name.toLowerCase().includes(searchLower) ||
          cc.subjectCode.toLowerCase().includes(searchLower) ||
          lecturerMap[cc.teacherId]?.toLowerCase().includes(searchLower) ||
          cc.room?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSemester) {
      result = result.filter((cc) => cc.semester === selectedSemester);
    }

    if (selectedTeacherId) {
      result = result.filter((cc) => cc.teacherId === selectedTeacherId);
    }

    return result;
  }, [
    creditClassesData,
    debouncedSearch,
    selectedSemester,
    selectedTeacherId,
    lecturerMap,
  ]);

  const handleSemesterFilterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value);
  };

  const handleTeacherFilterChange = (event: SelectChangeEvent) => {
    setSelectedTeacherId(event.target.value);
  };

  const handleAddCreditClass = () => {
    setEditingCreditClass(null);
    setFormOpen(true);
  };

  const handleEditCreditClass = (cc: CreditClass) => {
    setEditingCreditClass(cc);
    setFormOpen(true);
  };

  const handleDeleteClick = (cc: CreditClass) => {
    setCreditClassToDelete(cc);
    setDeleteDialogOpen(true);
  };

  const handleViewDetail = (cc: CreditClass) => {
    setSelectedDetailData(cc);
    setDetailDialogOpen(true);
  };

  const handleViewSchedule = (cc: CreditClass) => {
    setSelectedScheduleItems(cc.schedule || []);
    setSelectedCreditClassName(cc.name);
    setScheduleDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateCreditClassRequest) => {
    if (editingCreditClass) {
      updateCreditClassMutation.mutate(
        { id: editingCreditClass.id, data },
        {
          onSuccess: () => {
            toast.success("Cập nhật lớp tín chỉ thành công");
            setFormOpen(false);
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    } else {
      createCreditClassMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Thêm lớp tín chỉ thành công");
          setFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (creditClassToDelete) {
      deleteCreditClassMutation.mutate(creditClassToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa lớp tín chỉ thành công");
          setDeleteDialogOpen(false);
          setCreditClassToDelete(null);
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
          Danh sách lớp tín chỉ
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCreditClass}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Tìm kiếm lớp tín chỉ..."
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
                <TableCell>Tên lớp</TableCell>
                <TableCell>Mã học phần</TableCell>
                <TableCell>Giảng viên</TableCell>
                <TableCell>Nhóm</TableCell>
                <TableCell align="center">Sĩ số</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Lịch học</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="error">
                      Có lỗi xảy ra khi tải dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCreditClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredCreditClasses.map((cc) => (
                  <TableRow key={cc.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{cc.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cc.subjectCode}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {lecturerMap[cc.teacherId] || cc.teacherId}
                    </TableCell>
                    <TableCell>{cc.group || "-"}</TableCell>
                    <TableCell align="center">
                      <Chip label={cc.quantity} color="info" size="small" />
                    </TableCell>
                    <TableCell>{cc.room || "-"}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Xem chi tiết lịch học">
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() => handleViewDetail(cc)}
                          >
                            {formatScheduleDisplay(cc.schedule || [])}
                          </Typography>
                        </Tooltip>
                        {cc.schedule && cc.schedule.length > 0 && (
                          <Tooltip title="Xem chi tiết tiết thành phần">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewSchedule(cc)}
                              sx={{
                                ml: 0.5,
                                "&:hover": {
                                  bgcolor: "primary.light",
                                  color: "white",
                                },
                              }}
                            >
                              <CalendarTodayIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={cc.semester}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetail(cc)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditCreditClass(cc)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteClick(cc)}
                        >
                          <DeleteIcon />
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

      <CreditClassFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCreditClass}
        isLoading={
          createCreditClassMutation.isPending ||
          updateCreditClassMutation.isPending
        }
      />

      <CreditClassDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteCreditClassMutation.isPending}
      />

      <CreditClassDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedDetailData}
        lecturerName={
          selectedDetailData
            ? lecturerMap[selectedDetailData.teacherId]
            : undefined
        }
      />

      <ScheduleItemDetailDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        scheduleItems={selectedScheduleItems}
        creditClassName={selectedCreditClassName}
      />
    </Box>
  );
};
