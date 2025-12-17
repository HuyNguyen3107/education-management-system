import { http } from "@/libs/http.libs";
import { type PrerequisiteSubjectPublic } from "../types/public-prerequisite-subject.types";

export const getPublicPrerequisiteSubjects = async (userId?: string) => {
  const params = userId ? { userId } : {};
  const response = await http.get<PrerequisiteSubjectPublic[]>(
    "/api/prerequisite-subjects/public",
    { params }
  );
  return response.data;
};
