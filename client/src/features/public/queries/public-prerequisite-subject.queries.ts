import { useQuery } from "@tanstack/react-query";
import { getPublicPrerequisiteSubjects } from "../services/public-prerequisite-subject.services";

export const usePublicPrerequisiteSubjects = (userId?: string) => {
  return useQuery({
    queryKey: ["public-prerequisite-subjects", userId],
    queryFn: () => getPublicPrerequisiteSubjects(userId),
    enabled: true, // Always enable, fetching all if no userId, or specific if userId exists
  });
};
