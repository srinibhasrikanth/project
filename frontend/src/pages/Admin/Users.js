// Import necessary components and libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Button,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AdminNavbar from "../../components/AdminNavbar";

import * as XLSX from "xlsx";
// Define the Users component
const Users = () => {
  // Define state variables
  const [users, setUsers] = useState([]);
  const [downloadType, setDownloadType] = useState("");
  const [header, setHeader] = useState("");
  // Fetch users data from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/auth/get-all-users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle user deletion
  const handleDelete = async (userId) => {
    try {
      // Send a PUT request to update the user's delete flag
      await axios.put(
        `http://localhost:8000/api/v1/auth/delete-user/${userId}`
      );

      // Update the users state to remove the deleted user
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Function to export data to Excel
  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const data = users.map((user, index) => ({
      " S.No": index + 1,
      "Roll No": user.rollNumber,
      Name: user.name,
      "Phone No": user.whatsappNumber,
      Branch: user.branch,
      Year: user.year,
      Section: user.section,
      Admission: user.admission,
      Email: user.email,
      "Father's name": user.fatherName,
      "Father's Number": user.fatherWhatsappNumber,
      "Mother's Name": user.motherName,
      "Mother's Number": user.motherWhatsappNumber,
      Address: user.currentAddress,
      Laptop: user.laptop,
    }));

    // Convert data to XLSX format
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Save the Blob as a file
    saveAs(new Blob([excelBuffer]), "users.xlsx");
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
    fetchHeader(); // Fetch the header when the component mounts
  }, []);
  // Function to export data to PDF
  // Function to export data to PDF
  // Function to export data to PDF
  const handleExportToPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Calculate text width of the college name
    const collegeName = header; // Assuming header contains the college name
    const textWidth =
      (doc.getStringUnitWidth(collegeName) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;

    // Define columns for the table
    const columns = [
      "S.No",
      "Roll No",
      "Name",
      "Phone No",
      "Branch",
      "Year",
      "Section",
      "admission",
      "personalEmail",
      "Father's Name",
      "Father's Number",
      "Mother's Name",
      "Mother's Number",
      "Address",
      "Laptop",
    ];

    // Define rows for the table
    const rows = users.map((user, index) => [
      index + 1,
      user.rollNumber,
      user.name,
      user.whatsappNumber,
      user.branch,
      user.year,
      user.section,
      user.admission,
      user.personalEmail,
      user.fatherName,
      user.fatherWhatsappNumber,
      user.motherName,
      user.motherWhatsappNumber,
      user.currentAddress,
      user.laptop,
    ]);

    // Calculate starting Y position for the table based on college name length
    const startY =
      20 +
      (textWidth > doc.internal.pageSize.getWidth()
        ? 20
        : doc.getTextDimensions(collegeName).h);

    // Add college name at the top center
    doc.text(
      collegeName,
      (doc.internal.pageSize.getWidth() - textWidth) / 2,
      10
    );

    // Add table to PDF document
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY,
    });

    // Save the PDF
    doc.save("users.pdf");
  };

  // Function to handle download button click
  const handleDownload = () => {
    if (downloadType === "pdf") {
      handleExportToPDF();
    } else if (downloadType === "excel") {
      handleExportToExcel();
    }
  };

  // Return the JSX for the Users component
  return (
    <div>
      <AdminNavbar />
      <h3 className="text-2xl pb-5 pt-3 font-semibold text-center text-gray-700">
        STUDENT DETAILS
      </h3>
      <div className="flex justify-end space-x-2 mr-2">
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
          onClick={handleExportToExcel}
        >
          Download Excel
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
          onClick={handleExportToPDF}
        >
          Download PDF
        </Button>
      </div>

      <TableContainer
        component={Paper}
        style={{ margin: "40px", maxWidth: "1200px" }}
      >
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Admission</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Father's Name</TableCell>
              <TableCell>Father's Number</TableCell>
              <TableCell>Mother's Name</TableCell>
              <TableCell>Mother's Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Laptop</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.rollNumber}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.whatsappNumber}</TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>{user.year}</TableCell>
                <TableCell>{user.section}</TableCell>
                <TableCell>{user.admission}</TableCell>
                <TableCell>{user.personalEmail}</TableCell>
                <TableCell>{user.fatherName}</TableCell>
                <TableCell>{user.fatherWhatsappNumber}</TableCell>
                <TableCell>{user.motherName}</TableCell>
                <TableCell>{user.motherWhatsappNumber}</TableCell>
                <TableCell>{user.currentAddress}</TableCell>
                <TableCell>{user.laptop}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
