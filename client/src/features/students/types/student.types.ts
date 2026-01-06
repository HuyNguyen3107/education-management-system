export interface Student {
  id: string;
  studentCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentWithUser extends Student {
  user?: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    status: string;
    academicYear?: string;
    educationLevel?: string;
  };
}

export interface CreateStudentRequest {
  studentCode: string;
  userId: string;
}

export interface UpdateStudentRequest {
  studentCode?: string;
  userId?: string;
}

export interface PrerequisiteSubjectInfoDto {
  id: string;
  prerequisiteCode: string;
  prerequisiteName: string;
}

export interface SubjectResponseDto {
  id: string;
  name: string;
  subjectCode: string;
  majorId: string;
  specializationId: string;
  numberOfCredit: number;
  semester: string;
  ingredientSecretion: any;
  isStudied: boolean;
  prerequisites?: PrerequisiteSubjectInfoDto[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgramDto {
  semester: string;
  totalCredits: number;
  subjects: SubjectResponseDto[];
}
