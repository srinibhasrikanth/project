import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useAuth } from "../context/auth";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState("user");
  const { auth, logout } = useAuth();
  const [header, setHeader] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState([false, false]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    // Reset hover effect when location changes
    setIsHovered([false, false]);
  }, [location]);

  const handleClose = () => {
    setAnchorEl(null);
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
  useEffect(() => {}, [auth]);
  const fetchHeader = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/profile");
      setHeader(response.data.header);
    } catch (error) {
      console.error("Error fetching header:", error);
    }
  };

  useEffect(() => {
    fetchHeader();
  }, [auth]);
  const handleLogin = () => {
    navigate("/");
  };

  const handleSignup = () => {
    navigate("/signup");
  };
  return (
    <nav>
      <Link to="/" className="title flex">
        <img
          src="/images/vnrlogo.png" // Use the logoUrl directly
          alt="Logo"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "8px",
            cursor: "pointer",
          }}
        />
        {header}
      </Link>

      {auth.token ? (
        <>
          <div
            className={`menu ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className={menuOpen ? "open" : ""}>
            <li>
              <Button
                aria-controls="dropdown-menu"
                aria-haspopup="true"
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
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
                onClick={handleClick}
              >
                Instructor
              </Button>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                <MenuItem onClick={handleClose}>Option 3</MenuItem>
              </Menu>
            </li>
            <li>
              <Button
                aria-controls="dropdown-menu"
                aria-haspopup="true"
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
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
                onClick={handleClick}
              >
                Course
              </Button>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                <MenuItem onClick={handleClose}>Option 3</MenuItem>
              </Menu>
            </li>
            <li>
              <Button
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
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
                onClick={handleClick}
              >
                Student
              </Button>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Option 1</MenuItem>
                <MenuItem onClick={handleClose}>Option 2</MenuItem>
                <MenuItem onClick={handleClose}>Option 3</MenuItem>
              </Menu>
            </li>

            <li>
              <Button
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginRight: "10px",
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
                onClick={handleLogout}
                to="/"
              >
                Logout
                <LogoutIcon />
              </Button>
            </li>
          </ul>
        </>
      ) : (
        <>
          <div
            className={`menu ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
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
        </>
      )}
    </nav>
  );
};
