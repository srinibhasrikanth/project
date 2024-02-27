import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import UserNavbar from "../../components/UserNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [transaction, setTransaction] = useState("");
  const handleSubmit1 = async (formData) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const options = {
        key: "rzp_test_UpiX9NbPDSPRE9",
        key_secret: "xEfrmNVHeJldfK0klLrczorH",
        amount: 40000,
        currency: "INR",
        name: "Training App",
        description: "for testing purpose",
        handler: function (response) {
          console.log("Payment response:", response);
          setTransaction(response.razorpay_payment_id);

          // Proceed with form submission if payment is successful
          if (response.razorpay_payment_id) {
            submitForm(formData);
          }
        },
        prefill: {
          name: `${formData.fname}`,
          email: `${formData.email}`,
          contact: `${formData.mobileno}`,
        },
        notes: {
          address: "Razorpay Corporate office",
        },
        theme: {
          color: "#0d3e69",
        },
      };

      const pay = new window.Razorpay(options);

      // Open the Razorpay payment modal
      pay.open();
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  const submitForm = async (formData) => {
    try {
      const { confirmPassword, ...data1 } = formData;
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        data1
      );
      // console.log(formData);
      // const data = response.data;

      toast.success("Successfully registered");
      navigate("/");
    } catch (error) {
      console.log("Form submission error:", error);
    }
  };

  const fieldStyle = {
    marginBottom: "20px",
    width: "100%", // Adjust width for smaller fields
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column", // Change to column layout
    alignItems: "center", // Center items
    padding: "20px",
    maxWidth: "95%",
    margin: "auto",
  };

  const sectionStyle = {
    width: "100%", // Full width
    marginBottom: "30px", // Add margin between sections
  };

  const columnsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 4 columns
    gridGap: "20px", // Add gap between columns
    width: "100%",
  };

  return (
    <div>
      <UserNavbar />
      <div style={containerStyle}>
        {/* Section 1 */}
        <form onSubmit={handleSubmit(handleSubmit1)}>
          <div style={sectionStyle}>
            <Typography variant="h5" mb={2}>
              Section 1: Personal Details
            </Typography>

            <div style={columnsContainerStyle}>
              {/* Fields for Section 1 */}
              {/* Name, Roll No, Year, Branch */}

              <TextField
                label="Name"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("name")}
              />

              <TextField
                label="Roll No"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("rollNumber")}
              />

              <TextField
                label=" Year"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("year")}
              >
                {[1, 2, 3, 4].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Branch"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("branch")}
              >
                {[
                  "CSE",
                  "IT",
                  "ECE",
                  "EEE",
                  "Civil",
                  "Mechanical",
                  "CSE-AILML",
                  "CSE-CYS",
                  "CSE-AIDS",
                  "CSE-DS",
                ].map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Section"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("section")}
              >
                {["A", "B", "C", "D"].map((section) => (
                  <MenuItem key={section} value={section}>
                    {section}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Admission"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("admission")}
              >
                {["Regular", "LE"].map((admission) => (
                  <MenuItem key={admission} value={admission}>
                    {admission}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Gender"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("gender")}
              >
                {["Male", "Female", "Other"].map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Phone Number"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("phoneNumber")}
              />

              <TextField
                label="WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("whatsappNumber")}
              />

              <TextField
                label="Personal Email ID"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("personalEmail")}
              />

              <TextField
                label="Current Address"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("currentAddress")}
              />

              <TextField
                label="Permanent Address"
                variant="outlined"
                style={fieldStyle}
                {...register("permanentAddress")}
              />

              <TextField
                label="Laptop (Yes/No)"
                select
                variant="outlined"
                required
                style={fieldStyle}
                {...register("laptop")}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
              {/* Add more fields as needed */}
            </div>
          </div>

          {/* Section 2 */}
          <div style={sectionStyle}>
            <Typography variant="h5" mb={2}>
              Section 2: Parents Details
            </Typography>
            <div style={columnsContainerStyle}>
              {/* Fields for Section 2 */}
              <TextField
                label="Father's Name"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("fatherName")}
              />
              <TextField
                label="Profession"
                variant="outlined"
                style={fieldStyle}
                {...register("fatherProfession")}
              />
              <TextField
                label="Company"
                variant="outlined"
                style={fieldStyle}
                {...register("fatherCompany")}
              />

              <TextField
                label="Father's WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("fatherWhatsappNumber")}
              />

              <TextField
                label="Father's Address"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("fatherAddress")}
              />
              <TextField
                label="Mother's Name"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("motherName")}
              />
              <TextField
                label="Profession"
                variant="outlined"
                style={fieldStyle}
                {...register("motherProfession")}
              />
              <TextField
                label="Company"
                variant="outlined"
                style={fieldStyle}
                {...register("motherCompany")}
              />
              <TextField
                label="Mother's WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("motherWhatsappNumber")}
              />

              <TextField
                label="Mother's Address"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("motherAddress")}
              />

              {/* Add more fields for Section 2 */}
            </div>
          </div>

          {/* Section 3 */}

          <Typography variant="h5" mb={2}>
            Section 3: Authentication
          </Typography>
          <div style={sectionStyle} className="mr-10">
            <div style={columnsContainerStyle}>
              <TextField
                label="Username"
                variant="outlined"
                required
                style={fieldStyle}
                {...register("username")}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                required
                style={fieldStyle}
                {...register("password")}
              />
              <TextField
                label="Re-enter Password"
                variant="outlined"
                type="password"
                required
                style={fieldStyle}
                {...register("confirmPassword")}
              />
              {/* Add more fields for Section 3 */}
              {/* <Button
                type="submit"
                variant="contained"
                sx={{
                  marginRight: "10px",
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
                onClick={handleSubmit1}
                style={{ display: "block", width: "fit-content" }}
              >
                Create Account and Pay
              </Button> */}
            </div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              disabled={Object.keys(errors).length !== 0}
            >
              Create Account and Pay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
