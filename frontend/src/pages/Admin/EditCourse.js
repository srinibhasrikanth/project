import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
const EditCourse = ({ courseId }) => {
  const [courseDetails, setCourseDetails] = useState({
    courseName: "",
    timing: "",
    resourcePerson: "",
    duration: "",
    description: "",
    startDate: "",
  });

  const navigate = useNavigate();
  const [resourcePersons, setResourcePersons] = useState([]);

  useEffect(() => {
    const fetchResourcePersons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/resource/get-instructor"
        );
        setResourcePersons(response.data);
      } catch (error) {
        console.error("Error fetching resource persons:", error);
      }
    };

    fetchResourcePersons();
  }, []);

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

  const handleInputChange = (field, value) => {
    setCourseDetails({
      ...courseDetails,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const courseId = window.location.pathname.split("/").pop();
      const res = await axios.put(
        `http://localhost:8000/api/v1/courses/update-course/${courseId}`,
        {
          courseName: courseDetails.courseName,
          timing: courseDetails.timing,
          resourcePerson: courseDetails.resourcePerson,
          duration: courseDetails.duration,
          description: courseDetails.description,
          startDate: courseDetails.startDate,
        }
      );
      toast.success("Course successfully updated");

      const token = JSON.parse(localStorage.getItem("auth")).token;
      navigate(`/admin-dashboard/${token}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error updating course");
    }
  };

  const fieldStyle = {
    marginBottom: "20px",
    width: "100%",
  };

  const containerStyle = {
    textAlign: "center",
    maxWidth: "600px",
    margin: "auto",
    paddingTop: "20px",
  };

  return (
    <>
      <AdminNavbar />
      <div style={containerStyle}>
        <Typography variant="h5" mb={2}>
          EDIT COURSE DETAILS
        </Typography>
        <TextField
          label="Name of the Course"
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("courseName", e.target.value)}
          value={courseDetails.courseName}
          size="small"
        />
        <TextField
          label="Course Start Date"
          type="date"
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("startDate", e.target.value)}
          value={courseDetails.startDate}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
        />
        <div className="flex">
          <TextField
            label="Duration"
            variant="outlined"
            required
            style={{ ...fieldStyle, marginRight: "10px", flex: 1 }}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            value={courseDetails.duration}
            size="small"
          />
          <TextField
            label="Course Timings"
            variant="outlined"
            required
            style={{ ...fieldStyle, flex: 1 }}
            onChange={(e) => handleInputChange("timing", e.target.value)}
            value={courseDetails.timing}
            size="small"
          />
        </div>
        <TextField
          label="Resource Person"
          select
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("resourcePerson", e.target.value)}
          value={courseDetails.resourcePerson}
          size="small"
        >
          {resourcePersons.map((person) => (
            <MenuItem key={person.id} value={person.name}>
              {person.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Syllabus"
          multiline
          rows={4}
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("description", e.target.value)}
          value={courseDetails.description}
          size="small"
        />
        <Button
          variant="contained"
          sx={{
            marginTop: "10px",
            backgroundColor: "white",
            border: "1px solid",
            borderColor: "primary.main",
            color: "primary.main",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white",
              transform: "scale(1.05)",
            },
          }}
          type="button"
          onClick={handleSubmit}
        >
          Update Course
        </Button>
      </div>
    </>
  );
};

export default EditCourse;
