import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, isUpcoming }) => {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("auth")).token;
        const response = await axios.get(
          `/api/v1/registration/check-registration/${course._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };
    checkRegistration();
  }, [course._id]);

  const handleRegister = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/register-course/${token}/${course._id}`);
  };

  return (
    <div className="mb-5">
      <Card sx={{ minWidth: 275, height: 250 }} style={{ marginLeft: "10px" }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {course.courseName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            By {course.resourcePerson}
          </Typography>
          <Typography variant="body2">
            Mode: Offline
            <br />
            Duration: {course.duration} Hrs
            <br />
            Time: {course.timing}
          </Typography>
        </CardContent>
        <CardActions>
          {!isUpcoming && // Conditionally render the button only if it's not an upcoming course
            (isRegistered ? (
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
                disabled
              >
                Already Registered
              </Button>
            ) : (
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
                onClick={handleRegister}
              >
                Register Now
              </Button>
            ))}
        </CardActions>
      </Card>
    </div>
  );
};

export default CourseCard;
