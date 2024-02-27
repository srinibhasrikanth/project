import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { useAuth } from "../context/auth";
const Navbar = () => {
  const [header, setHeader] = useState("");
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const role = "user";
  const token = auth.token;
  const fetchHeader = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/profile");
      setHeader(response.data.header);
    } catch (error) {
      console.error("Error fetching header:", error);
    }
  };

  useEffect(() => {
    fetchHeader(); // Fetch the header when the component mounts
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = () => {
    const id = JSON.parse(localStorage.getItem("auth"))._id;

    navigate(`/change-password/${id}/${token}`);
  };

  return (
    <div className="p-4 bg-slate-100">
      {/*total navbar */}
      <div className=" flex justify-between">
        {/* flex div*/}
        <div className="flex gap-4">
          {/* left block logo and header*/}
          <img
            src="/images/vnrLogo.png"
            alt="none"
            width="40px"
            height="40px"
          />
          <h1 className="text-xl font-semibold">{header}</h1>
        </div>
        <div className="flex gap-4">
          {/*right block */}
          {role == "user" ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="black"
                style={{ fontSize: "35px" }}
              >
                <IoMdMenu className="text-3xl" />
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
            </>
          ) : (
            <>
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
              >
                <Link to="/" style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </Button>
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
              >
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  Signup
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
