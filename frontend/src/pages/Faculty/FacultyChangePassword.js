import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import UserNavbar from "../../components/UserNavbar";
import { Typography } from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const FacultyChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== reEnterNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/resource/reset-password/${id}/${token}`,
        {newPassword}
      );
      if (res.status === 200) {
        toast.success("Successfully changed");
        logout(); // logout first
        navigate("/instructor-login");
      }
    } catch (error) {
      toast.error("Error in changing password");
    }
    console.log("Form submitted:", {
      newPassword,
    });

    setError("");
  };

  return (
    <>
      <UserNavbar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 className="text-2xl pb-5 pt-3 font-semibold text-center text-gray-700">
            CHANGE PASSWORD
          </h3>
          <form onSubmit={handleSubmit}>
            <TextField
              id="old-password"
              label="Old Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              id="new-password"
              label="New Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              id="re-enter-new-password"
              label="Re-enter New Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={reEnterNewPassword}
              onChange={(e) => setReEnterNewPassword(e.target.value)}
              error={error !== ""}
              helperText={error}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Change Password
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default FacultyChangePassword;
