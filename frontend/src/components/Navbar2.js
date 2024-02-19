import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/auth";

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (auth?.user?.user?.role) {
      setUserRole(auth.user.user.role);
    }
  }, [auth]);

  const handleAdd = () => {
    navigate(`/add-course/${auth.token}`);
  };

  const handleProfile = () => {
    navigate(`/profile/${auth.token}`);
    setAnchorEl(null);
  };

  const handleInstructor = () => {
    navigate(`/add-instructor/${auth.token}`);
  };

  const handleLogout = () => {
    const isAdmin = userRole === "1";
    navigate(isAdmin ? "/admin-login" : "/");
    logout();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    if (auth.token) {
      navigate(`/admin-dashboard/${auth.token}`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item container alignItems="center" spacing={2}>
              <Grid item>
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
                <Typography variant="h6" sx={{ color: "black" }}>
                  VNRVJIET
                </Typography>
              </Grid>
              <Grid item container xs={10} justifyContent="flex-end">
                {auth?.token ? (
                  <>
                    {userRole === "1" ? (
                      <>
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
                            <MenuItem onClick={handleInstructor}>
                              Add instructor
                            </MenuItem>
                            <MenuItem onClick={handleAdd}>Add course</MenuItem>
                            <MenuItem onClick={handleProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                          </Menu>
                        </div>
                      </>
                    ) : (
                      <div className="flex ">
                        <Button
                          variant="outlined"
                          onClick={handleLogout}
                          style={{
                            "&:hover": { backgroundColor: "primary" },
                          }}
                          sx={{ marginLeft: "10px" }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleLogout}
                          style={{
                            "&:hover": { backgroundColor: "primary" },
                          }}
                          sx={{ marginLeft: "10px" }}
                        >
                          Logout
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Button>
                      <Link to="/" style={{ textDecoration: "none" }}>
                        Login
                      </Link>
                    </Button>
                    <Button>
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
