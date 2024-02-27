import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminCard = ({ course }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleActivate = async () => {
    try {
      await axios.put(
        `  http://localhost:8000/api/v1/courses/activate/${course._id}`
      );
      toast.success("Course activated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error activating course:", error);
    }
  };

  const handleEdit = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/edit-course/${token}/${course._id}`);
    setOpen(true); // Add this line to open the modal
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/courses/${course._id}`);
      toast.success("Course deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleDisable = async () => {
    try {
      await axios.put(
        ` http://localhost:8000/api/v1/courses/deactivate/${course._id}`
      );
      toast.success("Course deactivated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deactivating course:", error);
    }
  };

  const handleReport = () => {
    const token = JSON.parse(localStorage.getItem("auth")).token;
    navigate(`/course-report/${token}/${course._id}`);
  };

  return (
    <>
      <Card
        sx={{
          width: 270,
          height: 230,
          margin: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {course.courseName.length > 20 ? (
              <div>{course.courseName.slice(0, 20)}...</div>
            ) : (
              <div>{course.courseName}</div>
            )}
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
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px", // Adjusted padding
          }}
        >
          {course.upcoming === 0 && course.active === 0 && (
            <>
              <Button
                style={{ marginLeft: "auto" }}
                variant="contained"
                className="flex justify-end"
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginLeft: "5px",
                  marginRight: "5px", // Increased margin
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
            </>
          )}
          {course.upcoming === 1 && (
            <>
              <Button
                variant="contained"
                sx={{
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
                  marginLeft: "5px",
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
                onClick={handleEdit}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                sx={{
                  marginLeft: "5px",
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
                onClick={handleOpenModal}
              >
                <DeleteIcon />
              </Button>
            </>
          )}

          {course.active === 1 && (
            <div className="flex" style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                sx={{
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
                onClick={handleDisable}
              >
                Disable
              </Button>
              <Button
                variant="contained"
                sx={{
                  marginLeft: "5px",
                  marginRight: "5px", // Increased margin
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
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 200,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this course?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              mt: 2,
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
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              mt: 2,
              marginLeft: "5px",
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
            Confirm
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AdminCard;
