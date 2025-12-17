// Điểm thành phần
export interface ScoreItem {
  name: string; // Tên thành phần (Kiểm tra, Thực hành, Chuyên cần, Điểm thi, Điểm bài tập...)
  percentage: number; // Trọng số (%)
  score: number; // Điểm thành phần
}

// Lịch thi
export interface ExamScheduleItem {
  examType: string; // Kỳ thi (Thi kết thúc môn, Thi giữa kỳ...)
  subjectCode: string; // Mã môn học
  subjectName: string; // Tên môn học
  quantity: number; // Sĩ số
  examDate: string; // Ngày thi (dd/mm/yyyy)
  startTime: string; // Giờ bắt đầu (HH:mm)
  duration: number; // Thời gian làm bài (phút)
  room: string; // Phòng thi
  campus?: string; // Cơ sở
  examFormat: string; // Hình thức thi (Tự luận, Trắc nghiệm...)
}

export interface StudentCreditClass {
  id: string;
  studentId: string;
  creditClassId: string;
  scores?: ScoreItem[];
  examSchedule?: ExamScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentCreditClassRequest {
  studentId: string;
  creditClassId: string;
  scores?: ScoreItem[];
  examSchedule?: ExamScheduleItem[];
}

export interface UpdateStudentCreditClassRequest {
  studentId?: string;
  creditClassId?: string;
  scores?: ScoreItem[];
  examSchedule?: ExamScheduleItem[];
}
