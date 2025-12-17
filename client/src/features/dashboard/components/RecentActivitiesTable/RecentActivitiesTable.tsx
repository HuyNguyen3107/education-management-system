import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Chip, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const rows = [
  { id: 1, user: 'Nguyễn Văn A', action: 'Đăng ký môn học', date: '2023-10-25 14:30', status: 'completed' },
  { id: 2, user: 'Trần Thị B', action: 'Thanh toán học phí', date: '2023-10-25 13:15', status: 'pending' },
  { id: 3, user: 'Lê Văn C', action: 'Nộp bài tập', date: '2023-10-25 11:00', status: 'completed' },
  { id: 4, user: 'Phạm Thị D', action: 'Cập nhật hồ sơ', date: '2023-10-24 09:45', status: 'completed' },
  { id: 5, user: 'Hoàng Văn E', action: 'Đăng ký nghỉ phép', date: '2023-10-23 16:20', status: 'rejected' },
];

export const RecentActivitiesTable = () => {
  return (
    <Paper elevation={0} sx={{ borderRadius: '24px', border: '1px solid rgba(0,0,0,0.03)', overflow: 'hidden', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>Hoạt động gần đây</Typography>
        <IconButton size="small">
            <MoreVertIcon fontSize="small" sx={{ color: '#9ca3af' }} />
        </IconButton>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              <TableCell sx={{ py: 2, fontWeight: 600, color: '#6b7280', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6' }}>Sinh viên</TableCell>
              <TableCell sx={{ py: 2, fontWeight: 600, color: '#6b7280', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6' }}>Hành động</TableCell>
              <TableCell sx={{ py: 2, fontWeight: 600, color: '#6b7280', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6' }}>Thời gian</TableCell>
              <TableCell sx={{ py: 2, fontWeight: 600, color: '#6b7280', fontSize: '0.875rem', borderBottom: '1px solid #f3f4f6' }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 }, 
                    '&:hover': { bgcolor: '#f9fafb' },
                    transition: 'background-color 0.2s'
                }}
              >
                <TableCell component="th" scope="row" sx={{ py: 2.5, borderBottom: '1px solid #f3f4f6' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                            sx={{ 
                                width: 36, 
                                height: 36, 
                                fontSize: '0.875rem', 
                                bgcolor: row.id % 2 === 0 ? '#3b82f6' : '#8b5cf6',
                                fontWeight: 600 
                            }}
                        >
                            {row.user.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>{row.user}</Typography>
                    </Box>
                </TableCell>
                <TableCell sx={{ py: 2.5, color: '#4b5563', borderBottom: '1px solid #f3f4f6' }}>{row.action}</TableCell>
                <TableCell sx={{ py: 2.5, color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>{row.date}</TableCell>
                <TableCell sx={{ py: 2.5, borderBottom: '1px solid #f3f4f6' }}>
                  <Chip 
                    label={row.status === 'completed' ? 'Hoàn thành' : row.status === 'pending' ? 'Chờ xử lý' : 'Từ chối'} 
                    size="small" 
                    sx={{ 
                        height: 24,
                        borderRadius: '6px', 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        bgcolor: row.status === 'completed' ? '#ecfdf5' : row.status === 'pending' ? '#fffbeb' : '#fef2f2',
                        color: row.status === 'completed' ? '#059669' : row.status === 'pending' ? '#d97706' : '#dc2626',
                        border: '1px solid',
                        borderColor: row.status === 'completed' ? '#d1fae5' : row.status === 'pending' ? '#fde68a' : '#fee2e2'
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
