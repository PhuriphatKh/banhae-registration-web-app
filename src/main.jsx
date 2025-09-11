import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./components/Register.jsx";
import AdminHome from "./components/AdminHome.jsx";
import StudentHome from "./components/StudentHome.jsx";
import TeacherHome from "./components/TeacherHome.jsx";
import Profile from "./components/Profile.jsx";
import UserManagement from "./components/UserManagement.jsx";
import SubjectsManagement from "./components/SubjectsManagement.jsx";
import TimeTableManagement from "./components/TimeTableManagement.jsx";
import StudentTableManagement from "./components/StudentTableManagement.jsx";
import TeacherTableManagement from "./components/TeacherTableManagement.jsx";
import SchoolRecordManagement from "./components/SchoolRecordManagement.jsx";
import TeacherTable from "./components/TeacherTable.jsx";
import RequestPage from "./components/RequestPage.jsx";
import StudentTable from "./components/StudentTable.jsx";
import GradeManagement from "./components/GradeManagement.jsx";
import ManageSubjectScores from "./components/ManageSubjectScores.jsx";
import EditUserProfile from "./components/EditUserProfile.jsx";
import ManagerHome from "./components/ManagerHome.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AdminRoute from "./auth/AdminRoute.jsx";
import StudentRoute from "./auth/StudentRoute.jsx";
import TeacherRoute from "./auth/TeacherRoute.jsx";
import ManagerRoute from "./auth/ManagerRoute.jsx";
import GuestRoute from "./auth/GuestRoute.jsx";
import StudentRecords from "./components/StudentRecords.jsx";
import "./index.css";

import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { ProfileDataContextProvider } from "./context/ProfileDataContex.jsx";
import { StudentTableContexProvider } from "./context/StudentTableContex.jsx";
import { TeacherTableContexProvider } from "./context/TeacherTableContext.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestRoute>
        <App />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/usermanagement/profile",
    element: (
      <ProtectedRoute>
        <EditUserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/นักเรียน",
    element: (
      <ProtectedRoute>
        <StudentRoute>
          <StudentHome />
        </StudentRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student-table",
    element: (
      <ProtectedRoute>
        <StudentRoute>
          <StudentTable />
        </StudentRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student-records",
    element: (
      <ProtectedRoute>
        <StudentRoute>
          <StudentRecords />
        </StudentRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/ครู",
    element: (
      <ProtectedRoute>
        <TeacherRoute>
          <TeacherHome />
        </TeacherRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher-table",
    element: (
      <ProtectedRoute>
        <TeacherRoute>
          <TeacherTable />
        </TeacherRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/grade-management",
    element: (
      <ProtectedRoute>
        <TeacherRoute>
          <GradeManagement />
        </TeacherRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/grade-management/subject",
    element: (
      <ProtectedRoute>
        <TeacherRoute>
          <ManageSubjectScores />
        </TeacherRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/request",
    element: (
      <ProtectedRoute>
        <TeacherRoute>
          <RequestPage />
        </TeacherRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/แอดมิน",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <AdminHome />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/usermanagement",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <UserManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/subjects-management",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <SubjectsManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/time-table-management",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <TimeTableManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student-table-management",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <StudentTableManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher-table-management",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <TeacherTableManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/school-record-management",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <SchoolRecordManagement />
        </AdminRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/home/ผู้อำนวยการ",
    element: (
      <ProtectedRoute>
        <ManagerRoute>
          <ManagerHome />
        </ManagerRoute>
      </ProtectedRoute>
    ),
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <UserAuthContextProvider>
    <ProfileDataContextProvider>
      <StudentTableContexProvider>
        <TeacherTableContexProvider>
            <RouterProvider router={router} />
        </TeacherTableContexProvider>
      </StudentTableContexProvider>
    </ProfileDataContextProvider>
  </UserAuthContextProvider>
);
