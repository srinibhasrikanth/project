import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    // Implement logic to handle forgot password functionality
    // For now, we'll just log the email and navigate back to login
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/auth/forgot-password`,
        { email }
      );
      if (res.status === 200) {
        toast.success("Mail is sent");
        return (
          <>
            <h1>Mail is sent to the mail please check and login again</h1>
          </>
        );
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex justify-center mt-20">
        {/* Forgot Password Form */}
        <form className="border p-2 rounded-lg">
          <h3 className="text-2xl pb-5 pt-3 font-semibold text-center text-gray-700">
            Forgot Password
          </h3>
          <div
            className={`flex flex-row p-4 px-10 mb-2 ${
              emailError ? "border-red-500" : ""
            }`}
          >
            <TextField
              id="filled-email"
              label="Email"
              variant="filled"
              value={email}
              onChange={handleEmailChange}
              sx={{ width: "300px" }}
              error={emailError}
            />
          </div>
          <div className="flex pb-6 justify-center px-10">
            <Button
              variant="contained"
              sx={{
                marginTop: "20px",
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
            >
              Submit
            </Button>
          </div>
          <div className="flex justify-center">
            <Link
              to="/"
              style={{ textDecoration: "underline", color: "#1769aa" }}
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
