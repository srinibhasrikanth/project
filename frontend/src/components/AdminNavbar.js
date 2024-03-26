import React, { useState, useEffect } from "react";
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
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminNavbar() {
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [header, setHeader] = useState("");
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = () => {
    navigate(`/add-course/${auth.token}`);
    setAnchorEl(null);
  };

  const handleInstructor = () => {
    navigate(`/add-instructor/${auth.token}`);
    setAnchorEl(null);
  };

  const handleProfile = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/admin-profile/${token}`);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/admin-login");
    logout();
  };

  const handleLogoClick = () => {
    if (auth.token) {
      navigate(`/admin-dashboard/${auth.token}`);
    }
  };

  const fetchHeader = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/profile");
      setHeader(response.data.header);
    } catch (error) {
      console.error("Error fetching header:", error);
    }
  };

  useEffect(() => {
    fetchHeader(); // Fetch the header on every change
  }, [auth]); // Dependency array includes auth token to fetch header on auth change

  const handleStudentList = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/student-list/${token}`);
  };

  const handleChangePassword = () => {
    const id = JSON.parse(localStorage.getItem("auth")).user._id;
    const token = JSON.parse(localStorage.getItem("auth")).token;
    console.log(id);
    navigate(`/admin-change-password/${id}/${token}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Grid container alignItems="center" sx={{ flexGrow: 1 }}>
            <Grid item>
              <img
                onClick={handleLogoClick}
                src="/images/vnrlogo.png" // Use the logoUrl directly
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
                color="black"
                style={{ fontSize: "35px" }}
              >
                <MenuIcon fontSize="inherit" />
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
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleStudentList}>Student List</MenuItem>
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