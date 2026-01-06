import { http } from "@/libs/http.libs";
import type { TuitionCalculation } from "../types/tuition-calculation.types";

export const tuitionCalculationService = {
  calculateStudentTuition: async (
    studentId: string
  ): Promise<TuitionCalculation[]> => {
    const response = await http.get<TuitionCalculation[]>(
      `/tuition-calculation/student/${studentId}`
    );
    return response.data;
  },
};
