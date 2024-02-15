import React, { useEffect, useState } from "react";
import axios from "axios";
import FacultyCard from "./FacultyCard";
import FacultyNavbar from "../../components/FacultyNavbar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";

const UnauthenticatedDashboard = () => (
  <>
    <h1>Please login to access the dashboard</h1>
    <Link to="/">Click here to login</Link>
  </>
);

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`custom-tabpanel-${index}`}
      aria-labelledby={`custom-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `custom-tab-${index}`,
    "aria-controls": `custom-tabpanel-${index}`,
  };
}

const AuthenticatedDashboard = ({ token }) => {
  const [value, setValue] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/courses/get-all-courses?token=${token}`
        );
        setCourses(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const renderCourseRow = (courseList) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {courseList.map((course) => (
        <FacultyCard key={course.id} course={course} />
      ))}
    </div>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <FacultyNavbar />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="dashboard tabs"
          >
            <Tab label="Active Courses" {...a11yProps(0)} />
            <Tab label="Upcoming Courses" {...a11yProps(1)} />
            <Tab label="Completed Courses" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {renderCourseRow(courses.filter((course) => course.active === 1))}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {renderCourseRow(courses.filter((course) => course.upcoming === 1))}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {renderCourseRow(
            courses.filter(
              (course) => course.active !== 1 && course.upcoming !== 1
            )
          )}
        </CustomTabPanel>
      </Box>
    </>
  );
};

const FacultyDashboard = () => {
  const location = useLocation();
  const tokenFromUrl = new URLSearchParams(location.search).get("auth");
  const auth = JSON.parse(localStorage.getItem("auth")) || {};

  if (!auth.token) {
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard token={auth.token || tokenFromUrl} />;
};

export default FacultyDashboard;
