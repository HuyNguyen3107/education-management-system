import { useRoutes, Navigate } from "react-router-dom";
import { authRoutes } from "@/features/auth/routes/auth.routes";
import { ROUTE_PATHS } from "@/constants/route-path.constants";
import { DashboardLayout } from "@/features/dashboard/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { StudentsPage } from "@/features/students/pages/StudentsPage";
import { TrainingProgramPage } from "@/features/students/pages/TrainingProgramPage";
import { LecturersPage } from "@/features/lecturers/pages/LecturersPage";
import { NewsPage } from "@/features/news/pages/NewsPage";
import { MajorsPage } from "@/features/majors/pages/MajorsPage";
import { DepartmentsPage } from "@/features/departments/pages/DepartmentsPage";
import { SpecializationsPage } from "@/features/specializations/pages/SpecializationsPage";
import { ClassesPage } from "@/features/classes/pages/ClassesPage";
import { CreditClassesPage } from "@/features/credit-classes/pages/CreditClassesPage";
import { StudentCreditClassesPage } from "@/features/student-credit-classes/pages/StudentCreditClassesPage";
import { GradeEntryPage } from "@/features/student-credit-classes/pages/GradeEntryPage";
import { SubjectsPage } from "@/features/subjects/pages/SubjectsPage";
import { AspirationRegistersPage } from "@/features/aspiration-registers/pages/AspirationRegistersPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { TuitionsPage } from "@/features/tuitions/pages/TuitionsPage";
import { StudentTuitionsPage } from "@/features/student-tuitions/pages/StudentTuitionsPage";
import { StudentMajorsPage } from "@/features/student-majors/pages/StudentMajorsPage";
import { TimeRegistersPage } from "@/features/time-registers/pages/TimeRegistersPage";
import { PrerequisiteSubjectsPage } from "@/features/prerequisite-subjects/pages/PrerequisiteSubjectsPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { GuestGuard } from "@/components/guards/GuestGuard";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { PublicGuard } from "@/components/guards/PublicGuard";
import { PublicLayout } from "@/features/public/layouts/PublicLayout";
import { PublicHomePage } from "@/features/public/pages/PublicHomePage";
import { PublicNewsDetailPage } from "@/features/public/pages/PublicNewsDetailPage";
import { PublicNewsListPage } from "@/features/public/pages/PublicNewsListPage";
import { PublicAdminNotificationsPage } from "@/features/public/pages/PublicAdminNotificationsPage";
import { PublicNotificationDetailPage } from "@/features/public/pages/PublicNotificationDetailPage";
import { PublicPrerequisiteSubjectsPage } from "@/features/public/pages/PublicPrerequisiteSubjectsPage";
import { StudentWishlistRegistrationPage } from "@/features/aspiration-registers/pages/StudentWishlistRegistrationPage";
import { StudentSubjectRegistrationPage } from "@/features/student-credit-classes/pages/StudentSubjectRegistrationPage";
import { StudentTuitionViewingPage } from "@/features/student-tuitions/pages/StudentTuitionViewingPage";
import { StudentWeeklySchedulePage } from "@/features/student-credit-classes/pages/StudentWeeklySchedulePage";
import { StudentExamSchedulePage } from "@/features/student-credit-classes/pages/StudentExamSchedulePage";
import { StudentGradePage } from "@/features/student-credit-classes/pages/StudentGradePage";
import { LecturerLayout } from "@/features/lecturer-dashboard/layouts/LecturerLayout";
import { LecturerDashboardPage } from "@/features/lecturer-dashboard/pages/LecturerDashboardPage";
import { LecturerProfilePage } from "@/features/lecturer-dashboard/pages/LecturerProfilePage";
import { LecturerClassesPage } from "@/features/lecturer-dashboard/pages/LecturerClassesPage";
import { LecturerClassDetailPage } from "@/features/lecturer-dashboard/pages/LecturerClassDetailPage";
import { LecturerSchedulePage } from "@/features/lecturer-dashboard/pages/LecturerSchedulePage";
import { LecturerAdminClassesPage } from "@/features/lecturer-dashboard/pages/LecturerAdminClassesPage";
import { LecturerAdminClassStudentsPage } from "@/features/lecturer-dashboard/pages/LecturerAdminClassStudentsPage";

export const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: ROUTE_PATHS.HOME,
      element: <Navigate to={ROUTE_PATHS.LOGIN} replace />,
    },
    {
      path: "/lecturer",
      element: <AuthGuard />,
      children: [
        {
          element: <LecturerLayout />,
          children: [
            {
              index: true,
              element: <LecturerDashboardPage />,
            },
            {
              path: "profile",
              element: <LecturerProfilePage />,
            },
            {
              path: "classes",
              element: <LecturerClassesPage />,
            },
            {
              path: "classes/:id/students",
              element: <LecturerClassDetailPage />,
            },
            {
              path: "admin-classes",
              element: <LecturerAdminClassesPage />,
            },
            {
              path: "admin-classes/:id/students",
              element: <LecturerAdminClassStudentsPage />,
            },
            {
              path: "schedule",
              element: <LecturerSchedulePage />,
            },
          ],
        },
      ],
    },
    {
      path: "/public",
      element: <PublicGuard />,
      children: [
        {
          element: <PublicLayout />,
          children: [
            {
              path: "home",
              element: <PublicHomePage />,
            },
            {
              path: "home/all",
              element: <PublicNewsListPage />,
            },
            {
              path: "home/admin-notifications",
              element: <PublicAdminNotificationsPage />,
            },
            {
              path: "home/notification/:id",
              element: <PublicNotificationDetailPage />,
            },
            {
              path: "home/:id",
              element: <PublicNewsDetailPage />,
            },
            {
              path: "training-program",
              element: <TrainingProgramPage />,
            },
            {
              path: "prerequisite-subjects",
              element: <PublicPrerequisiteSubjectsPage />,
            },
            {
              path: "wishlist-registration",
              element: <StudentWishlistRegistrationPage />,
            },
            {
              path: "subject-registration",
              element: <StudentSubjectRegistrationPage />,
            },
            {
              path: "tuition-viewing",
              element: <StudentTuitionViewingPage />,
            },
            {
              path: "weekly-schedule",
              element: <StudentWeeklySchedulePage />,
            },
            {
              path: "exam-schedule",
              element: <StudentExamSchedulePage />,
            },
            {
              path: "grade-viewing",
              element: <StudentGradePage />,
            },
          ],
        },
      ],
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
              path: "grade-entry",
              element: <GradeEntryPage />,
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
              path: "student-majors",
              element: <StudentMajorsPage />,
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
