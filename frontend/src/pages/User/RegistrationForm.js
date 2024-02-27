import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";

const RegistrationForm = ({ course }) => {
  // State for course details
  const [courseDetails, setCourseDetails] = useState({});
  const navigate = useNavigate();

  const [registrationData, setRegistrationData] = useState({
    name: "",
    rollNumber: "",
    branch: "",
    year: "",
    section: "",
  });

  // State to track registration status
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setRegistrationData({
      ...registrationData,
      [field]: value,
    });
  };
  const [loading, setLoading] = useState(false);
  const [reg, setReg] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when button is clicked
    try {
      const courseId = window.location.pathname.split("/").pop();
      const res = await axios.post(
        ` http://localhost:8000/api/v1/registration/register-course/${courseId}`,
        {
          name: registrationData.name,
          rollNumber: registrationData.rollNumber,
          branch: registrationData.branch,
          year: registrationData.year,
          section: registrationData.section,
        }
      );

      // Check the response status code
      if (res.status === 201) {
        // Registration successful
        toast.success("Successfully registered");
        setRegistrationSuccess(true);
      } else if (res.status === 403) {
        // Bad request - Course already registered
        toast.error("Course already registered");
      } else {
        // Handle other status codes if needed
        toast.error("Unexpected error");
      }
    } catch (error) {
      console.error("Error registering course:", error);
      // Handle network errors or other exceptions
      toast.error("Error in registering. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  useEffect(() => {
    // Fetch course details from the backend
    const fetchCourseDetails = async () => {
      try {
        // Extract the course ID from the URL
        const courseId = window.location.pathname.split("/").pop(); // Assuming the course ID is the last part of the URL
        // Make a GET request to fetch course details
        const response = await axios.get(
          ` http://localhost:8000/api/v1/courses/get-course/${courseId}`
        );
        const courseData = response.data;
        // Update the courseDetails state with the fetched data
        setCourseDetails(courseData.course);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, []);

  useEffect(() => {
    // Fetch user details from the backend using the user ID stored in local storage
    const fetchUserData = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("auth"))._id;
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }
        const response = await axios.get(
          `  http://localhost:8000/api/v1/user/${userId}`
        );
        const userData = response.data;
        // Extract only the necessary fields for registration and set them in the state
        const { name, rollNumber, branch, year, section, whatsAppNumber } =
          userData;

        setRegistrationData({
          name,
          rollNumber,
          branch,
          year,
          section,
          whatsAppNumber,
        });
        try {
          // Extract the course ID from the URL
          const courseId = window.location.pathname.split("/").pop(); // Assuming the course ID is the last part of the URL
          // Make a GET request to fetch course details
          const response = await axios.post(
            ` http://localhost:8000/api/v1/registration/get-registered-or-not/${courseId}`,
            { rollNumber: rollNumber }
          );
          if (response.status === 200) {
            setReg(true);
          } else if (response.status === 203) {
            setReg(false);
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Styling
  const fieldStyle = {
    marginBottom: "20px",
    width: "100%",
  };

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    padding: "20px",
  };

  return (
    <>
      <>
        <UserNavbar />
        <div style={containerStyle}>
          <Grid container spacing={5}>
            {/* Left side - Course details */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" mb={2} sx={{ fontWeight: "bold" }}>
                    Course Details
                  </Typography>
                  <Typography variant="subtitle1" mb={2}>
                    <strong>Name :</strong> {courseDetails.courseName}
                  </Typography>

                  <Typography variant="subtitle1" mb={2}>
                    <strong>Timing:</strong> {courseDetails.timing}
                  </Typography>
                  <Typography variant="subtitle1" mb={2}>
                    <strong>Instructor:</strong> {courseDetails.resourcePerson}
                  </Typography>
                  <Typography variant="subtitle1" mb={2}>
                    <strong>Duration:</strong> {courseDetails.duration}
                  </Typography>
                  <Typography variant="subtitle1" mb={2}>
                    <strong>Course Syllabus:</strong>{" "}
                    {courseDetails.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Right side - Registration form */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" mb={2}>
                    Registration Form
                  </Typography>
                  <TextField
                    label="Name"
                    id="outlined-read-only-input"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    required
                    value={registrationData.name}
                    style={fieldStyle}
                    InputProps={{
                      readOnly: true,
                    }}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    size="small"
                  />
                  <TextField
                    variant="outlined"
                    label="Roll Number"
                    required
                    id="outlined-read-only-input"
                    style={fieldStyle}
                    onChange={(e) =>
                      handleInputChange("rollNo", e.target.value)
                    }
                    value={registrationData.rollNumber}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    variant="outlined"
                    required
                    label="Branch"
                    id="outlined-read-only-input"
                    style={fieldStyle}
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                    value={registrationData.branch}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    variant="outlined"
                    required
                    label="Year"
                    id="outlined-read-only-input"
                    style={fieldStyle}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    value={registrationData.year}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    variant="outlined"
                    required
                    label="Section"
                    id="outlined-read-only-input"
                    style={fieldStyle}
                    onChange={(e) =>
                      handleInputChange("section", e.target.value)
                    }
                    value={registrationData.section}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />

                  {reg ? (
                    <>
                      <Button variant="contained">
                        <Link to="/dashboard/:token">Explore more courses</Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      type="button"
                      disabled={loading} // Disable button when loading is true
                      onClick={handleSubmit}
                    >
                      {loading ? "Loading..." : "Register"}{" "}
                      {/* Show loading text when loading is true */}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </>
    </>
  );
};

export default RegistrationForm;
