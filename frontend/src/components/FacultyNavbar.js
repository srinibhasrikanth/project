import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyNavbar() {
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const [header, setHeader] = useState("");

  // Handle menu open
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    const id = JSON.parse(localStorage.getItem("auth"))._id;
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/faculty-change-password/${id}/${token}`);
  };

  // Handle profile click
  const handleProfile = () => {
    navigate(`/profile/${auth.token}`);
    handleClose();
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // logout first
    navigate("/instructor-login");
    handleClose();
  };

  // Handle logo click
  const handleLogoClick = () => {
    if (auth.token) {
      const id = JSON.parse(localStorage.getItem("auth"))._id;
      navigate(`/instructor-dashboard/${auth.token}/${id}`);
    }
  };

  const fetchHeader = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/profile");
      setHeader(response.data.header); // Update the header state with the fetched header
    } catch (error) {
      console.error("Error fetching header:", error);
    }
  };

  useEffect(() => {
    fetchHeader(); // Fetch the header when the component mounts
  }, [auth]); // Run the effect whenever the auth context changes

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Grid container alignItems="center" sx={{ flexGrow: 1 }}>
            <Grid item>
              <img
                onClick={handleLogoClick}
                src="/images/vnrlogo.png"
                alt="Logo"
                style={{
                  width: "40px",
                  height: "40px",
                  marginRight: "8px",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={{ color: "black" }}
                onClick={handleLogoClick}
              >
                {/* Display the header */}
                {header && <span>{header}</span>}
              </Typography>
            </Grid>
          </Grid>
          {auth?.token && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                // Changed color to "inherit"
              >
                <AccountCircle fontSize="inherit" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleChangePassword}>
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
