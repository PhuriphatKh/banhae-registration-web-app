import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./components/Register.jsx";
import AdminHome from "./components/AdminHome.jsx";
import StudentHome from "./components/StudentHome.jsx";
import Profile from "./components/Profile.jsx";
import UserManagement from "./components/UserManagement.jsx";
import StudentTableManagement from "./components/StudentTableManagement.jsx";
import TeacherTableManagement from "./components/TeacherTableManagement.jsx";
import SchoolRecordManagement from "./components/SchoolRecordManagement.jsx";
import EditUserProfile from "./components/EditUserProfile.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import AdminRoute from "./auth/AdminRoute.jsx";
import StudentRoute from "./auth/StudentRoute.jsx";
import GuestRoute from "./auth/GuestRoute.jsx";
import "./index.css";

import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import { ProfileDataContextProvider } from "./context/ProfileDataContex.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";

import React from "react";
import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
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
    path: "/usermanagement",
    element: (
      <ProtectedRoute>
        <UserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student-table-management",
    element: (
      <ProtectedRoute>
        <StudentTableManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher-table-management",
    element: (
      <ProtectedRoute>
        <TeacherTableManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/school-record-management",
    element: (
      <ProtectedRoute>
        <SchoolRecordManagement />
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
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <UserAuthContextProvider>
    <ProfileDataContextProvider>
      <RouterProvider router={router} />
    </ProfileDataContextProvider>
  </UserAuthContextProvider>
);
