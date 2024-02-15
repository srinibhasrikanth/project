import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FacultyCard = ({ course }) => {
  const navigate = useNavigate();

  const handleActivate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/courses/activate/${course._id}`
      );
      toast.success("Course activated successfully!");
      window.location.reload();
      // Optionally, you can update the local state or fetch courses again
      // to reflect the changes without reloading the page.
    } catch (error) {
      console.error("Error activating course:", error);
    }
  };

  const handleAttendance = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/course-attendance/${token}/${course._id}`);
  };
  const handleReport = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/instructor-course-report/${token}/${course._id}`);
  };

  return (
    <Card sx={{ minWidth: 270, height: 230 }} style={{ marginLeft: "10px" }}>
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
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginLeft: "5px",
          marginBottom: "5px",
        }}
      >
        {course.active === 1 && (
          <div className="flex">
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
              onClick={handleAttendance}
            >
              Attendance
            </Button>
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
              onClick={handleReport}
            >
              Report
            </Button>
          </div>
        )}
        {/* {course.upcoming === 1 && (
          <>
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
              onClick={handleActivate}
            >
              Activate
            </Button>
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
            >
              <EditIcon />
            </Button>
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
            >
              <DeleteIcon />
            </Button>
          </>
        )} */}
        {course.upcoming !== 1 && course.active !== 1 && (
          <Button
            variant="contained"
            sx={{
              marginLeft: "8px",
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={handleReport}
          >
            Report
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default FacultyCard;
