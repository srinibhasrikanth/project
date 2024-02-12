import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [touched, setTouched] = React.useState({
    username: false,
    password: false,
  });
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFieldBlur = (fieldName) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [fieldName]: true,
    }));
  };

  React.useEffect(() => {
    setUsernameError(touched.username && username.trim() === "");
  }, [touched.username, username]);

  React.useEffect(() => {
    setPasswordError(touched.password && password.length < 8);
  }, [touched.password, password]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log("Submit button clicked!");

    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", {
        rollNumber: username,
        password,
      });

      if (res.data.success) {
        setAuth({
          ...auth,
          user: res.data.rollNumber,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        const token = JSON.parse(localStorage.getItem("auth")).token;
        console.log(`/dashboard?token=${token}`);
        navigate(`/dashboard/${token}`);
        toast.success("Logged in successfully");
      } else {
        console.log("login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="flex justify-center mt-20">
        {/* Login Form */}
        <form className="border p-2 rounded-lg">
          <h3 className="text-2xl pb-5 pt-3 font-semibold text-center text-gray-700">
            Login
          </h3>
          <div
            className={`flex flex-row p-4 px-10 mb-2 ${
              usernameError ? "border-red-500" : ""
            }`}
          >
            <TextField
              id="filled-username"
              label="Username"
              variant="filled"
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => handleFieldBlur("username")}
              sx={{ width: "300px" }}
              error={usernameError}
            />
          </div>
          <div
            className={`flex flex-row p-4 px-10 mb-2 ${
              passwordError ? "border-red-500" : ""
            }`}
          >
            <TextField
              id="filled-password"
              label="Password"
              variant="filled"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleFieldBlur("password")}
              sx={{ width: "300px" }}
              error={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex pb-6 justify-between px-10">
            <Link
              to="/forgot-password"
              style={{ textDecoration: "underline", color: "#1769aa" }}
            >
              Forgot Password?
            </Link>
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
              onClick={handleSubmit}
            >
              LOGIN
            </Button>
          </div>
          <div className="flex justify-center">
            <Link
              to="/signup"
              style={{ textDecoration: "underline", color: "#1769aa" }}
            >
              Not registered yet? Signup now
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
