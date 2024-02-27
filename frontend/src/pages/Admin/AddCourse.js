import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";
import UserNavbar from "../../components/UserNavbar";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    courseName: "",
    timing: "",
    resourcePerson: "",
    duration: "",
    description: "",
    startDate: "",
  });
  const [errors, setErrors] = useState({
    courseName: "",
    startDate: "",
    duration: "",
    timing: "",
    resourcePerson: "",
  });

  const [resourcePersons, setResourcePersons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch resource persons from the backend API
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
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  const handleInputChange = (field, value) => {
    const validationErrors = { ...errors };

    if (!value.trim()) {
      validationErrors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    } else {
      validationErrors[field] = "";

      if (field === "timing") {
        // Validate course timings format
        const timingsRegex =
          /^((1[0-2]|0?[1-9]):([0-5][0-9])\s([APap][Mm])\s-\s(1[0-2]|0?[1-9]):([0-5][0-9])\s([APap][Mm]))$/;
        if (!timingsRegex.test(value.trim())) {
          validationErrors[field] =
            "Timings should be in the format HH:MM AM/PM - HH:MM AM/PM";
        }
      }
    }

    setErrors(validationErrors);
    setCourseData({
      ...courseData,
      [field]: value,
    });
  };

  const handleStartDateChange = (date) => {
    const validationErrors = { ...errors };

    if (!date) {
      validationErrors.startDate = "Course Start Date is required";
    } else {
      const selectedDate = new Date(date);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        validationErrors.startDate =
          "Course Start Date should be in the future";
      } else {
        validationErrors.startDate = "";
      }
    }

    setErrors(validationErrors);
    setCourseData({
      ...courseData,
      startDate: date,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when the form is submitted

    // Validate form fields
    const validationErrors = {};

    if (!courseData.courseName.trim()) {
      validationErrors.courseName = "Name of the Course is required";
    }

    if (!courseData.startDate) {
      validationErrors.startDate = "Course Start Date is required";
    } else {
      const selectedDate = new Date(courseData.startDate);
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        validationErrors.startDate =
          "Course Start Date should be in the future";
      }
    }

    if (!courseData.duration.trim() || isNaN(courseData.duration)) {
      validationErrors.duration = "Duration should be a valid number";
    }

    if (
      !courseData.timing.trim() ||
      !/^(\d{1,2}:\d{2}\s[APap][Mm])\s-\s(\d{1,2}:\d{2}\s[APap][Mm])$/.test(
        courseData.timing.trim()
      )
    ) {
      validationErrors.timing =
        "Timings should be in the format HH:MM AM/PM - HH:MM AM/PM";
    }

    if (!courseData.resourcePerson.trim()) {
      validationErrors.resourcePerson = "Resource Person is required";
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill out all required fields correctly");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      // Implement logic to handle the submitted course data
      console.log("Course data submitted:", courseData);
      // You can add further processing or send the data to an API
      const res = await axios.post(
        "http://localhost:8000/api/v1/courses/create-course",
        courseData
      );

      toast.success("Successfully course created");
      const token = JSON.parse(localStorage.getItem("auth")).token;
      navigate(`/admin-dashboard/${token}`);
      // Clear the input fields
      setCourseData({
        courseName: "",
        timing: "",
        resourcePerson: "",
        duration: "",
        description: "",
        startDate: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      // Handle an error if the submission fails
    } finally {
      setLoading(false); // Reset loading state after submission completes
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
      <div className="w-1/4 m-auto mt-10">
        
          <Typography variant="h5" mb={2} className="flex justify-center">
            ADD COURSE
          </Typography>
      
          <TextField
            label="Name of the Course"
            variant="outlined"
            required
            style={fieldStyle}
            onChange={(e) => handleInputChange("courseName", e.target.value)}
            value={courseData.courseName}
            error={!!errors.courseName}
            helperText={errors.courseName}
            size="small"
          />
          <div style={{ display: "flex" }}>
            <TextField
              label="Course Start Date"
              type="date"
              variant="outlined"
              required
              style={{ ...fieldStyle, flex: 1 }}
              onChange={(e) => handleStartDateChange(e.target.value)}
              value={courseData.startDate}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="Duration"
              variant="outlined"
              required
              style={{ ...fieldStyle, marginRight: "10px", flex: 1 }}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              value={courseData.duration}
              error={!!errors.duration}
              helperText={errors.duration}
              size="small"
            />
            <TextField
              label="Course Timings"
              variant="outlined"
              required
              style={{ ...fieldStyle, flex: 1 }}
              onChange={(e) => handleInputChange("timing", e.target.value)}
              value={courseData.timing}
              error={!!errors.timing}
              helperText={errors.timing}
              size="small"
            />
          </div>
          <TextField
            label="Instructor"
            select
            variant="outlined"
            required
            style={fieldStyle}
            onChange={(e) =>
              handleInputChange("resourcePerson", e.target.value)
            }
            value={courseData.resourcePerson}
            error={!!errors.resourcePerson}
            helperText={errors.resourcePerson}
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
            value={courseData.description}
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
            onClick={handleSubmit}
            disabled={loading} // Disable the button when loading is true
          >
            {loading ? "Adding Course..." : "Add Course"}{" "}
            {/* Show loading text when loading is true */}
          </Button>
        </div>
     
    </>
  );
};

export default AddCourse;
