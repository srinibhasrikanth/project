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
      <div className="w-1/4 m-auto mt-10">
        <Typography variant="h5" mb={2} className="flex justify-center">
          CHANGE PASSWORD
        </Typography>
        <TextField
          id="old-password"
          label="Old Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          size="small"
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
          size="small"
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
        >
          CHANGE PASSWORD
        </Button>
      </div>
    </>
  );
};

export default ChangePassword;
