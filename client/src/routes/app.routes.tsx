import { useRoutes, Navigate } from "react-router-dom";
import { authRoutes } from "@/features/auth/routes/auth.routes";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import { DashboardLayout } from "@/features/dashboard/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { StudentsPage } from "@/features/students/pages/StudentsPage";
import { LecturersPage } from "@/features/lecturers/pages/LecturersPage";
import { NewsPage } from "@/features/news/pages/NewsPage";
import { MajorsPage } from "@/features/majors/pages/MajorsPage";
import { DepartmentsPage } from "@/features/departments/pages/DepartmentsPage";
import { SpecializationsPage } from "@/features/specializations/pages/SpecializationsPage";
import { ClassesPage } from "@/features/classes/pages/ClassesPage";
import { CreditClassesPage } from "@/features/credit-classes/pages/CreditClassesPage";
import { StudentCreditClassesPage } from "@/features/student-credit-classes/pages/StudentCreditClassesPage";
import { SubjectsPage } from "@/features/subjects/pages/SubjectsPage";
import { AspirationRegistersPage } from "@/features/aspiration-registers/pages/AspirationRegistersPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { TuitionsPage } from "@/features/tuitions/pages/TuitionsPage";
import { StudentTuitionsPage } from "@/features/student-tuitions/pages/StudentTuitionsPage";
import { TimeRegistersPage } from "@/features/time-registers/pages/TimeRegistersPage";
import { PrerequisiteSubjectsPage } from "@/features/prerequisite-subjects/pages/PrerequisiteSubjectsPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { AuthGuard } from "@/components/guards/AuthGuard";

export const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: ROUTE_PATHS.HOME,
      element: <Navigate to={ROUTE_PATHS.LOGIN} replace />,
    },
    {
      element: <GuestGuard />,
      children: authRoutes,
    },
    {
      path: ROUTE_PATHS.DASHBOARD,
      element: <AuthGuard />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <DashboardPage />,
            },
            {
              path: "users",
              element: <UsersPage />,
            },
            {
              path: "students",
              element: <StudentsPage />,
            },
            {
              path: "lecturers",
              element: <LecturersPage />,
            },
            {
              path: "news",
              element: <NewsPage />,
            },
            {
              path: "majors",
              element: <MajorsPage />,
            },
            {
              path: "departments",
              element: <DepartmentsPage />,
            },
            {
              path: "specializations",
              element: <SpecializationsPage />,
            },
            {
              path: "classes",
              element: <ClassesPage />,
            },
            {
              path: "credit-classes",
              element: <CreditClassesPage />,
            },
            {
              path: "student-credit-classes",
              element: <StudentCreditClassesPage />,
            },
            {
              path: "subjects",
              element: <SubjectsPage />,
            },
            {
              path: "aspiration-registers",
              element: <AspirationRegistersPage />,
            },
            {
              path: "notifications",
              element: <NotificationsPage />,
            },
            {
              path: "tuitions",
              element: <TuitionsPage />,
            },
            {
              path: "student-tuitions",
              element: <StudentTuitionsPage />,
            },
            {
              path: "time-registers",
              element: <TimeRegistersPage />,
            },
            {
              path: "prerequisite-subjects",
              element: <PrerequisiteSubjectsPage />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
          ],
        },
      ],
    },
  ]);

  return routes;
};
