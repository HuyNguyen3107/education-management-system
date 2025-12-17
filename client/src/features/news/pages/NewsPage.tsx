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
  TablePagination,
  Checkbox,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  useNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
  useDeleteNewsBatch,
} from "../queries/news.queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState, useEffect } from "react";
import { NewsFormDialog } from "../components/NewsFormDialog";
import { NewsDeleteDialog } from "../components/NewsDeleteDialog";
import { NewsDetailDialog } from "../components/NewsDetailDialog";
import type { News, CreateNewsRequest } from "../types/news.types";
import { toast } from "react-toastify";
import { usePageMeta } from "@/hooks/usePageMeta";

// Helper function to strip HTML tags for preview
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const NewsPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null); // For single delete
  const [isBatchDelete, setIsBatchDelete] = useState(false);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<News | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: newsData, isLoading } = useNews({
    page,
    size: rowsPerPage,
    search: debouncedSearch,
    sort: "createdAt,desc",
  });

  const newsList = Array.isArray(newsData) ? newsData : newsData?.content || [];
  const totalElements = Array.isArray(newsData)
    ? newsData.length
    : newsData?.totalElements || 0;

  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();
  const deleteBatchMutation = useDeleteNewsBatch();

  usePageMeta(
    "Quản lý tin tức",
    "Tạo, chỉnh sửa và xóa tin tức hiển thị trên cổng thông tin."
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && newsList.length > 0) {
      setSelectedIds(newsList.map((n) => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setFormOpen(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setFormOpen(true);
  };

  const handleViewDetail = (news: News) => {
    setSelectedNewsDetail(news);
    setDetailDialogOpen(true);
  };

  const handleDeleteOne = (news: News) => {
    setNewsToDelete(news);
    setIsBatchDelete(false);
    setDeleteDialogOpen(true);
  };

  const handleBatchDelete = () => {
    setIsBatchDelete(true);
    setNewsToDelete(null);
    setDeleteDialogOpen(true);
  };

  const handleSubmitForm = async (data: CreateNewsRequest) => {
    try {
      if (editingNews) {
        await updateMutation.mutateAsync({ id: editingNews.id, data });
        toast.success("Cập nhật tin tức thành công");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Thêm mới tin tức thành công");
      }
      setFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (isBatchDelete) {
        await deleteBatchMutation.mutateAsync(selectedIds);
        toast.success(`Đã xóa ${selectedIds.length} tin tức`);
        setSelectedIds([]);
      } else if (newsToDelete) {
        await deleteMutation.mutateAsync(newsToDelete.id);
        toast.success("Xóa tin tức thành công");
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa");
    }
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý tin tức
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNews}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {selectedIds.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
            >
              Xóa ({selectedIds.length})
            </Button>
          )}
        </Box>

        <TableContainer className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      newsList.length > 0 &&
                      selectedIds.length === newsList.length
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < newsList.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : newsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      Không tìm thấy dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                newsList.map((news) => (
                  <TableRow key={news.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(news.id)}
                        onChange={() => handleSelectOne(news.id)}
                      />
                    </TableCell>
                    <TableCell width="30%">
                      <Typography fontWeight={500}>{news.title}</Typography>
                    </TableCell>
                    <TableCell width="40%">
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "text.secondary",
                        }}
                      >
                        {stripHtml(news.content)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(news.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="info"
                          onClick={() => handleViewDetail(news)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditNews(news)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteOne(news)}
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

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Paper>

      <NewsFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingNews}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <NewsDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        count={isBatchDelete ? selectedIds.length : 1}
        title={newsToDelete?.title}
        isLoading={deleteMutation.isPending || deleteBatchMutation.isPending}
      />

      <NewsDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedNewsDetail}
      />
    </Box>
  );
};
