import { Paper, Box, Typography, Button } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const data = [
  { name: 'T1', revenue: 4000 },
  { name: 'T2', revenue: 3000 },
  { name: 'T3', revenue: 2000 },
  { name: 'T4', revenue: 2780 },
  { name: 'T5', revenue: 1890 },
  { name: 'T6', revenue: 2390 },
  { name: 'T7', revenue: 3490 },
  { name: 'T8', revenue: 4200 },
  { name: 'T9', revenue: 3800 },
  { name: 'T10', revenue: 5000 },
  { name: 'T11', revenue: 4500 },
  { name: 'T12', revenue: 6000 },
];

export const RevenueChart = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: '24px',
        bgcolor: '#ffffff',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0,0,0,0.03)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
            Tổng doanh thu
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            (+43%) so với năm ngoái
          </Typography>
        </Box>
        <Button 
            variant="outlined" 
            size="small" 
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
                borderRadius: '10px', 
                textTransform: 'none', 
                color: '#6b7280', 
                borderColor: '#e5e7eb',
                '&:hover': {
                    borderColor: '#d1d5db',
                    bgcolor: '#f9fafb'
                }
            }}
        >
            2023
        </Button>
      </Box>
      
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ color: '#111827', fontWeight: 600 }}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
