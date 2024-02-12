import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import FacultyCard from "./FacultyCard";
import FacultyNavbar from "../../components/FacultyNavbar";

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
        const id = window.location.pathname.split("/").pop(); // Assuming the course ID is the last part of the URL

        const response = await axios.get(
          `http://localhost:8000/api/v1/courses/get-course-by-instructor/${id}`
        );
        console.log(`url token: ${token}`);
        setCourses(response.data.course);
        console.log(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const renderCourseRow = (courseList) => {
    if (!Array.isArray(courseList)) {
      return <p>No courses available</p>;
    }

    return (
      <div
        className="ml-10"
        style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
      >
        {courseList.map((course) => (
          <FacultyCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <>
      <FacultyNavbar />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div>
            <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold ">
              My Active Courses
            </h1>
            {Array.isArray(courses) &&
              courses.length > 0 &&
              renderCourseRow(courses.filter((course) => course.active === 1))}

            <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold ">
              My Upcoming Courses
            </h1>
            {Array.isArray(courses) &&
              courses.length > 0 &&
              renderCourseRow(
                courses.filter((course) => course.upcoming === 1)
              )}
          </div>
        )}
      </div>
    </>
  );
};

const FacultyDashboard = () => {
  const location = useLocation();
  const tokenFromUrl = new URLSearchParams(location.search).get("auth");
  const auth = JSON.parse(localStorage.getItem("auth")) || {};

  if (!auth.token) {
    console.log("login please");
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard token={auth.token || tokenFromUrl} />;
};

export default FacultyDashboard;
