import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardPage } from '../pages/DashboardPage';
import { BrowserRouter } from 'react-router-dom';

// Mock the child components to simplify testing
vi.mock('../components/StatCard/StatCard', () => ({
  StatCard: ({ title, value }: { title: string, value: string }) => (
    <div data-testid="stat-card">
      {title}: {value}
    </div>
  ),
}));

vi.mock('../components/RecentActivitiesTable/RecentActivitiesTable', () => ({
  RecentActivitiesTable: () => <div data-testid="recent-activities">Recent Activities Table</div>,
}));

vi.mock('../components/RevenueChart/RevenueChart', () => ({
  RevenueChart: () => <div data-testid="revenue-chart">Revenue Chart</div>,
}));

vi.mock('../components/EnrollmentChart/EnrollmentChart', () => ({
  EnrollmentChart: () => <div data-testid="enrollment-chart">Enrollment Chart</div>,
}));

describe('DashboardPage', () => {
  it('renders the dashboard header', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Xin chào, Admin!/i)).toBeInTheDocument();
    expect(screen.getByText(/Hôm nay là/i)).toBeInTheDocument();
  });

  it('renders all statistic cards', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    
    const statCards = screen.getAllByTestId('stat-card');
    expect(statCards).toHaveLength(4);
    
    expect(screen.getByText(/Tổng số sinh viên/i)).toBeInTheDocument();
    expect(screen.getByText(/Giảng viên/i)).toBeInTheDocument();
    expect(screen.getByText(/Lớp học đang mở/i)).toBeInTheDocument();
    expect(screen.getByText(/Doanh thu tháng/i)).toBeInTheDocument();
  });

  it('renders the charts', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    expect(screen.getByTestId('enrollment-chart')).toBeInTheDocument();
  });

  it('renders the recent activities table', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
  });
  
  it('renders notifications section', () => {
      render(
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Thông báo mới')).toBeInTheDocument();
      expect(screen.getAllByText(/Thông báo hệ thống/i).length).toBeGreaterThan(0);
  });
});
