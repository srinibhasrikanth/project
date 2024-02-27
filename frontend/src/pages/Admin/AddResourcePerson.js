import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { Alert } from "@mui/material";
import { toast } from "react-toastify";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

const AddResource = ({ onResourcePersonAdded }) => {
  const [resourcePersonData, setResourcePersonData] = useState({
    name: "",
    email: "",
    designation: "",
    mobileNumber: "",
    id: "",
  });
  const navigate = useNavigate();
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  const [loading, setLoading] = useState(false); // Add loading state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    designation: "",
    rollNo: "",
    idNumber: "",
    phoneNo: "",
  });

  const handleInputChange = (field, value) => {
    setResourcePersonData({
      ...resourcePersonData,
      [field]: value,
    });

    // Clear the corresponding error when the user starts typing
    setErrors({
      ...errors,
      [field]: "",
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when form is submitted

    // Validate form fields
    const validationErrors = {};

    if (!resourcePersonData.name.trim()) {
      validationErrors.name = "Name is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !resourcePersonData.email.trim() ||
      !emailPattern.test(resourcePersonData.email.trim())
    ) {
      validationErrors.email = "Enter a valid email address";
    }

    if (!resourcePersonData.designation) {
      validationErrors.designation = "Designation is required";
    }

    // if (
    //   resourcePersonData.designation === "Student" &&
    //   !resourcePersonData.id.trim()
    // ) {
    //   validationErrors.rollNo = "Roll Number is required";
    // }

    // if (
    //   resourcePersonData.designation === "Faculty" &&
    //   !resourcePersonData.id.trim()
    // ) {
    //   validationErrors.idNumber = "ID Number is required";
    // }

    if (
      !resourcePersonData.mobileNumber.trim() ||
      resourcePersonData.mobileNumber.trim().length !== 10
    ) {
      validationErrors.phoneNo = "Enter a valid 10-digit phone number";
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill out all required fields correctly");
      setLoading(false); // Reset loading state
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/resource/create-instructor",
        resourcePersonData
      );
      console.log("Resource person data submitted:", resourcePersonData);
      setSuccessAlertOpen(true);
      toast.success("Successfully added");
      const token = JSON.parse(localStorage.getItem("auth")).token;
      navigate(`/admin-dashboard/${token}`);
      // Clear the form or reset state if needed
      setResourcePersonData({
        name: "",
        email: "",
        designation: "",
        mobileNumber: "",
        id: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error if submission fails
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
    maxWidth: "400px",
    margin: "auto",
    paddingTop: "30px",
  };

  return (
    <>
      <AdminNavbar />
      <div className="w-1/4 m-auto mt-10">
        <Typography variant="h5" mb={2} className="flex justify-center">
          ADD INSTRUCTOR
        </Typography>

        <TextField
          label="Name"
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={resourcePersonData.name}
          error={!!errors.name}
          helperText={errors.name}
          size="small"
        />
        <TextField
          label="Email"
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("email", e.target.value)}
          value={resourcePersonData.email}
          error={!!errors.email}
          helperText={errors.email}
          size="small"
        />
        <TextField
          label="Designation (Student/Faculty)"
          select
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("designation", e.target.value)}
          value={resourcePersonData.designation}
          error={!!errors.designation}
          helperText={errors.designation}
          size="small"
        >
          {["Student", "Faculty"].map((designation) => (
            <MenuItem key={designation} value={designation}>
              {designation}
            </MenuItem>
          ))}
        </TextField>
        {resourcePersonData.designation === "Student" ? (
          <TextField
            label="Roll Number"
            variant="outlined"
            style={fieldStyle}
            onChange={(e) => handleInputChange("id", e.target.value)}
            value={resourcePersonData.id}
            error={!!errors.rollNo}
            helperText={errors.rollNo}
            size="small"
          />
        ) : (
          <TextField
            label="ID Number"
            variant="outlined"
            style={fieldStyle}
            onChange={(e) => handleInputChange("id", e.target.value)}
            value={resourcePersonData.id}
            error={!!errors.idNumber}
            helperText={errors.idNumber}
            size="small"
          />
        )}
        <TextField
          label="Phone Number"
          variant="outlined"
          required
          style={fieldStyle}
          onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
          value={resourcePersonData.mobileNumber}
          error={!!errors.phoneNo}
          size="small"
          helperText={errors.phoneNo}
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
          disabled={loading} // Disable button when loading is true
        >
          {loading ? "Loading..." : "ADD INSTRUCTOR"}{" "}
          {/* Show loading text when loading is true */}
        </Button>
      </div>
    </>
  );
};

export default AddResource;
