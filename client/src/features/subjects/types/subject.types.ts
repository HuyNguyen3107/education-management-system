export interface IngredientSecretion {
  name: string;
  periods: number; // Số tiết
}

export interface Subject {
  id: string;
  name: string;
  subjectCode: string;
  majorId?: string;
  specializationId?: string;
  numberOfCredit?: number;
  ingredientSecretion: IngredientSecretion[];
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  name: string;
  subjectCode: string;
  majorId?: string;
  specializationId?: string;
  numberOfCredit?: number;
  ingredientSecretion: IngredientSecretion[];
  semester: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  subjectCode?: string;
  majorId?: string;
  specializationId?: string;
  numberOfCredit?: number;
  ingredientSecretion?: IngredientSecretion[];
  semester?: string;
}
