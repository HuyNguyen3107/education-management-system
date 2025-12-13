// Mục lịch học
export interface ScheduleItem {
  dayOfWeek: string; // Thứ (2, 3, 4, 5, 6, 7, CN)
  startPeriod: number; // Tiết bắt đầu
  numberOfPeriods: number; // Số tiết
  startDate: string; // Ngày bắt đầu (yyyy-MM-dd)
  endDate: string; // Ngày kết thúc (yyyy-MM-dd)
  room?: string; // Phòng học (tùy chọn)
}

export interface CreditClass {
  id: string;
  subjectCode: string;
  teacherId: string;
  group?: string;
  name: string;
  quantity: number;
  room?: string;
  schedule?: ScheduleItem[];
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCreditClassRequest {
  subjectCode: string;
  teacherId: string;
  group?: string;
  name: string;
  quantity: number;
  room?: string;
  schedule?: ScheduleItem[];
  semester: string;
}

export interface UpdateCreditClassRequest {
  subjectCode?: string;
  teacherId?: string;
  group?: string;
  name?: string;
  quantity?: number;
  room?: string;
  schedule?: ScheduleItem[];
  semester?: string;
}
