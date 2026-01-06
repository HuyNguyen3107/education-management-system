export interface TuitionCalculation {
  studentId: string;
  studentCode: string;
  academicYear: string;
  currentYearNumber: number;
  currentSemester: string;
  currentYear: string;
  totalCredits: number;
  pricePerCredit: number;
  totalTuition: number;
  tuitionId: string;
  subjectDetails: SubjectDetail[];
}

export interface SubjectDetail {
  subjectCode: string;
  subjectName: string;
  credits: number;
  semester: string;
}
