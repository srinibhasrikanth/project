import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import UserNavbar from "../../components/UserNavbar";
import { Typography } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
        `http://localhost:8000/api/v1/auth/reset-password/${id}/${token}`,
        {
          oldPassword,
          newPassword,
        }
      );

      if (res.status === 200) {
        toast.success("Successfully changed");
        setOldPassword("");
        setNewPassword("");
        setReEnterNewPassword("");
        logout();
        // Redirect to your desired path after password change
        navigate("/");
      }
    } catch (error) {
      toast.error("Error in changing password");
    }
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
          <Typography
            variant="h4"
            className="pb-5 pt-3 font-semibold text-center text-gray-700"
          >
            CHANGE PASSWORD
          </Typography>
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

            <Button
              type="submit"
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
            >
              Change Password
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default ChangePassword;
