import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import UserDashboard from "./pages/User/UserDashboard";
import RegistrationForm from "./pages/User/RegistrationForm";
import AdminLogin from "./pages/Admin/AdminLogin";
import AddCourse from "./pages/Admin/AddCourse";
import AddResourcePerson from "./pages/Admin/AddResourcePerson";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ReportTable from "./pages/Admin/ReportTable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FacultyLogin from "./pages/Faculty/FacultyLogin";
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import Attendance from "./pages/Faculty/Attendance";
import FacultyReport from "./pages/Faculty/FacultyReport";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import EditCourse from "./pages/Admin/EditCourse";
import AdminProfile from "./pages/Admin/AdminProfile";
import FacultyChangePassword from "./pages/Faculty/FacultyChangePassword";
import AdminChangePassword from "./pages/Admin/AdminChangePassword";
import Attendees from "./pages/Faculty/Attendees";
import Users from "./pages/Admin/Users";
import AttendanceTable from "./pages/Faculty/AttendanceTable";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import PDF from "./pages/PDF";
import Attendance1 from "./pages/Attendance1";
import Chart from "./components/Chart1";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-profile/:token" element={<AdminProfile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/instructor-login" element={<FacultyLogin />} />
        <Route
          path="/instructor-dashboard/:token/:id"
          element={<FacultyDashboard />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/edit-course/:token/:id" element={<EditCourse />} />
        <Route
          path="/change-password/:id/:token"
          element={<ChangePassword />}
        />
        <Route
          path="/faculty-change-password/:id/:token"
          element={<FacultyChangePassword />}
        />
        <Route
          path="/admin-change-password/:id/:token"
          element={<AdminChangePassword />}
        />
        <Route
          path="/instructor-course-report/:token/:id"
          element={<FacultyReport />}
        />
        <Route path="/course-attendance/:token/:id" element={<Attendance />} />

        <Route path="/dashboard/:token" element={<UserDashboard />} />
        <Route
          path="/register-course/:token/:id"
          element={<RegistrationForm />}
        />
        <Route path="/admin-dashboard/:token" element={<AdminDashboard />} />
        <Route path="/add-course/:token" element={<AddCourse />} />
        <Route path="/add-instructor/:token" element={<AddResourcePerson />} />
        <Route path="/student-list/:token" element={<Users />} />
        <Route path="/course-report/:token/:id" element={<ReportTable />} />
        <Route path="/attendance-table/:id" element={<AttendanceTable />} />
      </Routes>
    </>
  );
};

export default App;
