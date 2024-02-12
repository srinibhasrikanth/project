import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { Link, useLocation } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

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
          ` http://localhost:8000/api/v1/courses/get-all-courses?token=${token}
`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const renderCourseRow = (courseList, isUpcoming) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "flex-start",
      }}
    >
      {courseList.map((course) => (
        <Card
          key={course.id}
          course={course}
          isUpcoming={isUpcoming}
          style={{ maxWidth: "calc(25% - 20px)" }}
        />
      ))}
    </div>
  );

  return (
    <>
      <UserNavbar />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <div>
              <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold">
                Active Courses
              </h1>
              {renderCourseRow(
                courses.filter((course) => course.active === 1),
                false
              )}

              <h1 className="ml-10 mt-5 mb-5 text-2xl font-semibold">
                Upcoming Courses
              </h1>
              {renderCourseRow(
                courses.filter((course) => course.upcoming === 1),
                true
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const tokenFromUrl = new URLSearchParams(location.search).get("auth");
  const auth = JSON.parse(localStorage.getItem("auth")) || {};

  if (!auth.token && !tokenFromUrl) {
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard token={auth.token || tokenFromUrl} />;
};

export default Dashboard;
