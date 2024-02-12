import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useAuth } from "../context/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import axios from "axios";

export default function UserNavbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};
  const token = storedAuth.token;
  const [isHovered, setIsHovered] = useState([false, false]);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [header, setHeader] = useState("");

  useEffect(() => {
    // Reset hover effect when location changes
    setIsHovered([false, false]);
  }, [location]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    // Check if the user is an admin and redirect accordingly
    if (auth?.user?.user?.role === "1") {
      navigate("/admin-login");
    } else {
      navigate("/");
    }

    logout();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    if (token) {
      navigate(`/dashboard/${token}`);
    }
  };

  const handleChangePassword = () => {
    const id = JSON.parse(localStorage.getItem("auth"))._id;

    navigate(`/change-password/${id}/${token}`);
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
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Logo and Text "VNRVJIET" on the left */}
            <Grid
              item
              container
              alignItems="center"
              spacing={2}
              className="flex"
            >
              <Grid item>
                {/* Add Link component around the logo */}
                <img
                  src="/images/vnrlogo.png"
                  alt="Logo"
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "8px",
                    cursor: "pointer",
                  }}
                  onClick={handleLogoClick}
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

              <Grid item xs={6} md={4} lg={3} container justifyContent="flex-end">
                {auth?.token ? (
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
                ) : (
                  <div className="flex gap-4">
                    <Button
                      variant={isHovered[0] ? "contained" : "outlined"}
                      onMouseEnter={() => setIsHovered([true, false])}
                      onMouseLeave={() => setIsHovered([false, false])}
                      style={{
                        "&:hover": { backgroundColor: "#your-hover-color" },
                      }}
                    >
                      <Link to="/" style={{ textDecoration: "none" }}>
                        Login
                      </Link>
                    </Button>

                    <Button
                      variant={isHovered[1] ? "contained" : "outlined"}
                      onMouseEnter={() => setIsHovered([false, true])}
                      onMouseLeave={() => setIsHovered([false, false])}
                      style={{
                        "&:hover": { backgroundColor: "#your-hover-color" },
                      }}
                    >
                      <Link to="/signup" style={{ textDecoration: "none" }}>
                        Signup
                      </Link>
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
