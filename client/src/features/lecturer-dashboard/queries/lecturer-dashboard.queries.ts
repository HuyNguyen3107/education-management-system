import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lecturerServices } from "../services/lecturer-dashboard.services";
import type { UpdateGradeRequest } from "../types/lecturer-dashboard.types";
import { toast } from "react-toastify";

export const useLecturerProfile = () => {
  return useQuery({
    queryKey: ["lecturer", "profile"],
    queryFn: lecturerServices.getProfile,
  });
};

export const useLecturerClasses = () => {
  return useQuery({
    queryKey: ["lecturer", "classes"],
    queryFn: lecturerServices.getClasses,
  });
};

export const useLecturerClassStudents = (classId: string) => {
  return useQuery({
    queryKey: ["lecturer", "classes", classId, "students"],
    queryFn: () => lecturerServices.getClassStudents(classId),
    enabled: !!classId,
  });
};

export const useUpdateStudentGrade = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: string;
      data: UpdateGradeRequest;
    }) => lecturerServices.updateGrade(classId, studentId, data),
    onSuccess: () => {
      toast.success("Cập nhật điểm thành công");
      queryClient.invalidateQueries({
        queryKey: ["lecturer", "classes", classId, "students"],
      });
    },
    onError: () => {
      toast.error("Cập nhật điểm thất bại");
    },
  });
};

export const useLecturerSchedule = () => {
  return useQuery({
    queryKey: ["lecturer", "schedule"],
    queryFn: lecturerServices.getSchedule,
  });
};
