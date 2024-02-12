import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const { id, token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/auth/reset-password/${id}/${token}`,
        { newPassword }
      );

      // Reset password logic here

      // Clear form fields and error state
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      // Redirect to login page after successful password reset
      navigate("/");
      toast.success("Successfully password changed");
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex justify-center mt-20">
        <form className="border p-2 rounded-lg" onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Reset Password
          </Typography>
          {error && (
            <Typography variant="body2" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <div className="flex flex-col gap-4 px-4">
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />
          </div>
          <div className="flex justify-between px-4">
            <Link
              to="/"
              style={{ textDecoration: "underline", color: "#1769aa" }}
            >
              Remember your password?
              <br />
              Login
            </Link>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: "10px" }}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
