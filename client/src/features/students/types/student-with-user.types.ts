import type { Student } from "./student.types";
import type { User } from "@/features/users/types/user.types";

export interface StudentWithUserData extends Student {
  user?: User;
}
