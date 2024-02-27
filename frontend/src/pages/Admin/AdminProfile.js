import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AdminNavbar from "../../components/AdminNavbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
const AdminProfile = () => {
  const [headerName, setHeaderName] = useState("");
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogo(file);
  };

  const token = JSON.parse(localStorage.getItem("auth")).token;
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("header", headerName);
      formData.append("logo", logo);

      const res = await axios.put(
        "http://localhost:8000/api/v1/profile/update",
        { header: headerName }
      );
      console.log(headerName);
      if (res.status === 200) {
        toast.success("Profile updated successfully!");
      }

      setHeaderName("");
      setLogo(null);
      navigate(`/admin-dashboard/${token}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const fieldStyle = {
    marginBottom: "20px",
    width: "100%",
  };

  return (
    <>
      <AdminNavbar />
      <div className="w-1/4 m-auto mt-10">
        <Typography variant="h5" mb={2} className="flex justify-center">
          PROFILE
        </Typography>
        <TextField
          id="header-name"
          label="Header Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={headerName}
          onChange={(e) => setHeaderName(e.target.value)}
          size="small"
        />

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
          fullWidth
        >
          Update Profile
        </Button>
      </div>
    </>
  );
};

export default AdminProfile;
