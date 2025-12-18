import type { Lecturer } from "./lecturer.types";
import type { User } from "@/features/users/types/user.types";

export interface LecturerWithUserData extends Lecturer {
  user?: User;
}
