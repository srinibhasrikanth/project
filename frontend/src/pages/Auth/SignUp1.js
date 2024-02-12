import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserNavbar from "../../components/UserNavbar";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    year: "",
    branch: "",
    section: "",
    admission: "",
    gender: "",
    phoneNumber: "",
    whatsappNumber: "",
    personalEmail: "",
    currentAddress: "",
    permanentAddress: "",
    laptop: "",
    fatherName: "",
    profession: "",
    fatherCompany: "",
    motherName: "",
    motherProfession: "",
    motherCompany: "",
    fatherWhatsappNumber: "",
    parentAddress: "",
    username: "",
    password: "",
    confirmPassword: "",
    razorpayTransactionId: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    var options = {
      key: "rzp_test_UpiX9NbPDSPRE9",
      key_secret: "xEfrmNVHeJldfK0klLrczorH",
      amount: 400 * 100,
      currency: "INR",
      name: "Membership Payment",
      description: "for testing purpose",
      handler: function (response) {
        toast.success("Payment is successful");
        // Store the Razorpay transaction ID in the form data
        setFormData((prevData) => ({
          ...prevData,
          razorpayTransactionId: response.razorpay_payment_id,
        }));

        console.log(response.razorpayTransactionId);
      },
      prefill: {
        name: `${formData.name}`,
        email: `${formData.email}`,
        contact: `${formData.phone}`,
      },
      notes: {
        address: "Razorpay Corporate office",
      },
      theme: {
        color: "#0d3e69",
      },
    };
    var pay = new window.Razorpay(options);
    pay.on("payment.success", async function (response) {
      // Payment successful
      toast.success("Payment is successful");
      // Store the Razorpay transaction ID in the form data
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
        formData
      );
      console.log(res.data);
      toast.success("Successfully registered");
      navigate("/");
      toast.success("Login Here");
      setFormData((prevData) => ({
        ...prevData,
        razorpayTransactionId: response.razorpay_payment_id,
      }));
      console.log(response.razorpayTransactionId);
      // Make API request to save user registration data
    });
    pay.open();
  };

  const fieldStyle = {
    marginBottom: "20px",
    width: "100%",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "100%",
    margin: "auto",
  };

  const sectionStyle = {
    width: "100%",
    marginBottom: "30px",
  };

  const columnsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridGap: "20px",
    width: "100%",
  };

  return (
    <>
      <UserNavbar />
      <div>
        <div style={containerStyle}>
          {/* Section 1 */}
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                name="name"
              />

              <TextField
                label="Roll No"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("rollNumber", e.target.value)
                }
                name="rollNumber"
              />

              <TextField
                label="Which Year"
                select
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) => handleInputChange("year", e.target.value)}
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
                onChange={(e) => handleInputChange("branch", e.target.value)}
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
                onChange={(e) => handleInputChange("section", e.target.value)}
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
                onChange={(e) => handleInputChange("admission", e.target.value)}
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
                onChange={(e) => handleInputChange("gender", e.target.value)}
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
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />

              <TextField
                label="WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("whatsappNumber", e.target.value)
                }
              />

              <TextField
                label="Personal Email ID"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("personalEmail", e.target.value)
                }
              />

              <TextField
                label="Current Address"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("currentAddress", e.target.value)
                }
              />

              <TextField
                label="Permanent Address"
                variant="outlined"
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("permanentAddress", e.target.value)
                }
              />

              <TextField
                label="Laptop (Yes/No)"
                select
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) => handleInputChange("laptop", e.target.value)}
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
                onChange={(e) =>
                  handleInputChange("fatherName", e.target.value)
                }
              />
              <TextField
                label="Profession"
                variant="outlined"
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
              />
              <TextField
                label="Company"
                variant="outlined"
                style={fieldStyle}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
              <TextField
                label="Father's WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("fatherWhatsappNumber", e.target.value)
                }
              />
              <TextField
                label="Father's Address"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("parentAddress", e.target.value)
                }
              />
              <TextField
                label="Mother's Name"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("motherName", e.target.value)
                }
              />
              <TextField
                label="Profession"
                variant="outlined"
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("motherProfession", e.target.value)
                }
              />
              <TextField
                label="Company"
                variant="outlined"
                style={fieldStyle}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
              <TextField
                label="Mother's WhatsApp Number"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("fatherWhatsappNumber", e.target.value)
                }
              />
              <TextField
                label="Mother's Address"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("parentAddress", e.target.value)
                }
              />
              {/* Add more fields for Section 2 */}
            </div>
          </div>

          {/* Section 3 */}
          <div style={sectionStyle}>
            <Typography variant="h5" mb={2}>
              Section 3: Authentication
            </Typography>
            <div style={columnsContainerStyle}>
              {/* Fields for Section 3 */}
              {/* Username, Password, etc. */}
              <TextField
                label="Username"
                variant="outlined"
                required
                style={fieldStyle}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                required
                style={fieldStyle}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <TextField
                label="Re-enter Password"
                variant="outlined"
                type="password"
                required
                style={fieldStyle}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
              {/* Add more fields for Section 3 */}
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={handleSubmit}
                style={{
                  display: "block",
                  margin: "auto",
                  width: "fit-content",
                }}
              >
                Create Account and Pay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
