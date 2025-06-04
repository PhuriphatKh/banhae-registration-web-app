import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./components/Register.jsx";
import AdminHome from "./components/AdminHome.jsx";
import StudentHome from "./components/StudentHome.jsx";
import TeacherHome from "./components/TeacherHome.jsx";
import Profile from "./components/Profile.jsx";
import UserManagement from "./components/UserManagement.jsx";
import StudentTableManagement from "./components/StudentTableManagement.jsx";
import TeacherTableManagement from "./components/TeacherTableManagement.jsx";
import SchoolRecordManagement from "./components/SchoolRecordManagement.jsx";
import TeacherTable from "./components/TeacherTable.jsx";
import GradeManagement from "./components/GradeManagement.jsx";
import GradeManagementStudent from "./components/GradeManagementStudent.jsx";
import EditUserProfile from "./components/EditUserProfile.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AdminRoute from "./auth/AdminRoute.jsx";
import StudentRoute from "./auth/StudentRoute.jsx";
import GuestRoute from "./auth/GuestRoute.jsx";
import "./index.css";

import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { ProfileDataContextProvider } from "./context/ProfileDataContex.jsx";
import { StudentTableContexProvider } from "./context/StudentTableContex.jsx";
import { TeacherTableContexProvider } from "./context/TeacherTableContext.jsx";
import { StudentGradesContexProvider } from "./context/StudentGradesContex.jsx";

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
    path: "/home/ครู",
    element: (
      <ProtectedRoute>
        <TeacherHome />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher-table",
    element: (
      <ProtectedRoute>
        <TeacherTable />
      </ProtectedRoute>
    ),
  },
  {
    path: "/grade-management",
    element: (
      <ProtectedRoute>
        <GradeManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/grade-management/student",
    element: (
      <ProtectedRoute>
        <GradeManagementStudent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/studenthome",
    element: (
      <ProtectedRoute>
        <StudentHome />
      </ProtectedRoute>
    ),
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
    path: "/home/admin",
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
    path: "/usermanagement/profile",
    element: (
      <ProtectedRoute>
        <AdminRoute>
          <EditUserProfile />
        </AdminRoute>
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
          <StudentGradesContexProvider>
            <RouterProvider router={router} />
          </StudentGradesContexProvider>
        </TeacherTableContexProvider>
      </StudentTableContexProvider>
    </ProfileDataContextProvider>
  </UserAuthContextProvider>
);
