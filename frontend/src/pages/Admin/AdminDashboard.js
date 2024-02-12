import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import AdminCard from "./AdminCard";
import AdminNavbar from "../../components/AdminNavbar";

const UnauthenticatedDashboard = () => (
  <>
    <h1>Please login to access the dashboard</h1>
    <Link to="/">Click here to login</Link>
  </>
);

const AuthenticatedDashboard = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/courses/get-all-courses?token=${token}`
        );
        console.log(`url token: ${token}`);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, courses.active, courses.upcoming]);

  const renderCourseRow = (courseList) => (
    <div
      className="ml-10"
      style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
    >
      {courseList.map((course) => (
        <AdminCard key={course.id} course={course} />
      ))}
    </div>
  );

  return (
    <>
      <AdminNavbar />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div>
            <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold ">
              Active Courses
            </h1>
            {renderCourseRow(courses.filter((course) => course.active === 1))}

            <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold ">
              Upcoming Courses
            </h1>
            {renderCourseRow(courses.filter((course) => course.upcoming === 1))}
            <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold ">
              Completed Courses
            </h1>
            {renderCourseRow(
              courses.filter(
                (course) => course.active !== 1 && course.upcoming !== 1
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const tokenFromUrl = new URLSearchParams(location.search).get("auth");
  const auth = JSON.parse(localStorage.getItem("auth")) || {}; // Parse the JSON string

  console.log(auth.token);

  if (!auth.token) {
    console.log("login please");
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard token={auth.token || tokenFromUrl} />;
};

export default AdminDashboard;
