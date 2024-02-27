import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminCard from "./AdminCard";
import AdminNavbar from "../../components/AdminNavbar";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { useAuth } from "../../context/auth";

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
    "aria-controls": ` custom-tabpanel-${index}`,
  };
}

const AuthenticatedDashboard = ({ token }) => {
  const [value, setValue] = React.useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const handleAddCourse = () => {
    navigate(`/add-course/${auth.token}`);
  };
  const handleAddInstructor = () => {
    navigate(`/add-instructor/${auth.token}`);
  };

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

  const renderCourseRow = (courseList) => {
    if (courseList.length === 0) {
      return (
        <h1 className="text-5xl flex justify-center items-center">
          No Courses Available
        </h1>
      );
    }
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {courseList.map((course) => (
          <AdminCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <AdminNavbar />
      <Box sx={{ width: "100%" }}>
        <div className="flex justify-between">
          <div>
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
          </div>
          <div className="mt-2">
            <Button
              onClick={handleAddCourse}
              variant="contained"
              sx={{
                borderRadius: "16px",
                backgroundColor: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              <AddCircleOutlinedIcon className="mr-2" />
              Add Course
            </Button>
            <Button
              variant="contained"
              onClick={handleAddInstructor}
              sx={{
                borderRadius: "16px",
                marginRight: "10px",
                marginLeft: "10px",
                backgroundColor: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  transform: "scale(1.05)",
                },
              }}
            >
              <AddCircleOutlinedIcon className="mr-2" />
              Add instructor
            </Button>
          </div>
        </div>

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

const AdminDashboard = () => {
  const location = useLocation();
  const tokenFromUrl = new URLSearchParams(location.search).get("auth");
  const auth = JSON.parse(localStorage.getItem("auth")) || {};

  if (!auth.token) {
    return <UnauthenticatedDashboard />;
  }

  return <AuthenticatedDashboard token={auth.token || tokenFromUrl} />;
};

export default AdminDashboard;
