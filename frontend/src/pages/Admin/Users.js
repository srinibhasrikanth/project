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
  FormControl,
  InputLabel,
} from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AdminNavbar from "../../components/AdminNavbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [downloadType, setDownloadType] = useState("");

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

  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const data = users.map((user, index) => ({
      "S.No": index + 1,
      "Roll No": user.rollNumber,
      Name: user.name,
      "Phone No": user.whatsappNumber,
    }));

    // Convert data to CSV format
    const csv = [
      Object.keys(data[0]).join(","), // header row
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

    // Save the Blob as a file
    saveAs(blob, "users.csv");
  };

  const handleExportToPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: "User Details",
    });

    // Define columns for the table
    const columns = ["S.No", "Roll No", "Name", "Phone No"];

    // Define rows for the table
    const rows = users.map((user, index) => [
      index + 1,
      user.rollNumber,
      user.name,
      user.whatsappNumber,
    ]);

    // Add table to PDF document
    doc.autoTable({
      head: [columns],
      body: rows,
    });

    // Save the PDF
    doc.save("users.pdf");
  };

  const handleDownload = () => {
    if (downloadType === "pdf") {
      handleExportToPDF();
    } else if (downloadType === "excel") {
      handleExportToExcel();
    }
  };

  return (
    <div>
      <AdminNavbar />
      <Typography
        variant="h3"
        className="text-2xl pb-5 pt-3 font-semibold text-center text-gray-700"
        style={{ textAlign: "center" }}
      >
        Student Details
      </Typography>
      <Select
        value={downloadType}
        onChange={(e) => setDownloadType(e.target.value)}
        className="flex w-36 ml-10 "
      >
        <MenuItem value="pdf">PDF</MenuItem>
        <MenuItem value="excel">Excel</MenuItem>
      </Select>

     
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        disabled={!downloadType}
        style={{ marginRight: "10px" }}
      >
        Download
      </Button>
      <TableContainer
        component={Paper}
        style={{ marginLeft: "140px", maxWidth: "1000px", marginTop: "20px" }}
      >
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.rollNumber}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.whatsappNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
