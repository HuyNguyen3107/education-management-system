export interface LecturerProfile {
  id: string;
  teacherCode: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
}

export interface LecturerClass {
  id: string;
  subjectCode: string;
  teacherId: string;
  group: string;
  name: string;
  quantity: number;
  room: string;
  schedule: ScheduleItem[];
  semester: string;
  enrolledCount: number;
}

export interface ScheduleItem {
  dayOfWeek: string;
  startPeriod: number;
  numberOfPeriods: number;
  startDate: string;
  endDate: string;
  room: string;
}

export interface LecturerStudent {
  studentId: string;
  studentName: string;
  studentCode: string;
  scores: StudentScores;
}

export interface StudentScores {
  attendance?: number;
  midterm?: number;
  final?: number;
  total_10?: number;
  total_4?: number;
  letter?: string;
  passed?: boolean;
  components?: ScoreComponent[];
}

export interface ScoreComponent {
  name: string;
  weight: number;
  score: number;
}

export interface UpdateGradeRequest {
  scores: StudentScores;
}

export interface AdministrativeClass {
  id: string;
  classCode: string;
  teacherId: string;
  majorId: string;
  specializationId: string;
  createdAt: string;
  updatedAt: string;
}
