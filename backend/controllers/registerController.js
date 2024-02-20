const mongoose = require("mongoose");
const registerModel = require("../models/registerModel");
const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const registrationCourse = async (req, res) => {
  try {
    // Extract course ID from request parameters
    const courseId = req.params.courseId;

    // Extract registration data from request body
    const registrationData = req.body;

    // Check if the student has already registered for the course
    const existingRegistration = await registerModel.findOne({
      courseId: courseId,
      rollNumber: registrationData.rollNumber, // Assuming rollNumber is unique for each student
    });

    if (existingRegistration) {
      // If the registration already exists, return an error response
      return res
        .status(403)
        .json({ message: "Student already registered for this course" });
    }
    // Fetch user details to get the email
    const user = await userModel.findOne({
      rollNumber: registrationData.rollNumber,
    });
    // Create a new registration document using the registerModel
    const registration = new registerModel({
      ...registrationData, // Spread the registrationData object
      courseId: courseId,
      whatsappNumber: user.whatsappNumber, // Assign courseId
    });

    // Save the registration document to the database
    await registration.save();

    const userEmail = user.personalEmail;
    const userName = user.name; // Assuming the user model contains a 'name' field

    // Fetch course details to get course name, timings, and startDate
    const courseDetails = await courseModel.findById(courseId);
    const courseName = courseDetails.courseName;
    const timings = courseDetails.timing;
    const startDate = courseDetails.startDate;

    // Send registration confirmation email
    await sendRegistrationEmail(
      userEmail,
      userName,
      courseName,
      timings,
      startDate
    );

    // Respond with a success message
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    // Handle any errors and send an appropriate response
    console.error("Error registering course:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const reg = await registerModel.find({});
    res.status(200).json(reg);
  } catch (error) {
    console.error("Error fetching :", error);
    res.status(500).json({
      success: false,
      message: "Error fetching ",
      error: error.message,
    });
  }
};

// Function to send registration email
const sendRegistrationEmail = async (
  userEmail,
  userName,
  courseName,
  timings,
  startDate
) => {
  try {
    // Format the start date
    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const formattedStartDate = formatDate(startDate);
    let transporter = nodemailer.createTransport({
      // Your email configuration, such as service, auth, etc.
      // Example for Gmail:
      service: "gmail",
      auth: {
        user: "srinibha.srikanth@gmail.com",
        pass: process.env.pass,
      },
    });

    // Define the email body
    const emailBody = `
      Dear ${userName},
      
      Thank you for registering for the course "${courseName}". Below are the details:
      
      Course Name: ${courseName}
      Timings: ${timings}
      Start Date: ${formattedStartDate}
      
      We look forward to seeing you in the class.
      
      Best regards,
      Your Organization
    `;

    // Send mail with defined transport object
    // Send mail with defined transport object
    await transporter.sendMail({
      from: "srinibha.srikanth@gmail.com",
      to: userEmail, // This should be the recipient's email address
      subject: "Registration Confirmation",
      text: emailBody,
    });

    console.log("Registration email sent successfully.");
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error; // Propagate the error to the calling function
  }
};
const getEachController = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Fetch registrations for the specified course ID
    const registrations = await registerModel.find({ courseId: courseId });

    if (registrations.length > 0) {
      // Extract course name and resource person from the first registration
      const courseId = registrations[0].courseId;
      const courseDetails = await courseModel.findById(courseId);
      if (!courseDetails) {
        return res.status(404).json({ message: "Course not found" });
      }

      const courseName = courseDetails.courseName;
      const resourcePerson = courseDetails.resourcePerson;

      // Extract user details for each registration
      const userDetailsPromises = registrations.map(async (registration) => {
        const user = await userModel.findOne({
          rollNumber: registration.rollNumber,
        });
        return user ? user.whatsappNumber : null;
      });

      const userDetails = await Promise.all(userDetailsPromises);

      return res.status(200).json({
        registrations,
        courseName,
        resourcePerson,
        userDetails,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No registrations found for courseId" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// const saveAttendanceController = async (req, res) => {
//   try {
//     // Assuming req.body contains an array of registration objects
//     const registrations = req.body.registrations;

//     // Loop through each registration object and save/update attendance in the database
//     await Promise.all(
//       registrations.map(async (registration) => {
//         // Find the registration document in the database
//         const existingRegistration = await registerModel.findOne({
//           rollNumber: registration.rollNumber,
//           // Add any other conditions if necessary to uniquely identify a registration
//         });

//         if (existingRegistration) {
//           // Update the attendance field for the existing registration
//           existingRegistration.attendance = registration.attendance;

//           // Save the updated registration document
//           await existingRegistration.save();
//         } else {
//           // Handle case where registration doesn't exist
//           // This could happen if the frontend sends incomplete data or if the registration was not found
//           console.error(
//             `Registration not found for roll number: ${registration.rollNumber}`
//           );
//           // You might choose to return an error response in this case
//         }
//       })
//     );

//     // Respond with success message
//     res.status(200).json({ message: "Attendance data saved successfully" });
//   } catch (error) {
//     console.error("Error saving attendance data:", error);
//     res.status(500).json({ error: "An unexpected error occurred" });
//   }
// };

// const saveAttendanceController = async (req, res) => {
//   try {
//     // Extract the attendance data and attendance date from the request body
//     const { updatedAttendances, attendanceDate } = req.body;

//     // Loop through each attendance record and save/update attendance in the database
//     await Promise.all(
//       updatedAttendances.map(async ({ rollNumber, attendance }) => {
//         // Find the registration document in the database
//         const existingRegistration = await registerModel.findOne({
//           rollNumber: rollNumber,
//           // Add any other conditions if necessary to uniquely identify a registration
//         });

//         if (existingRegistration) {
//           // Update the attendance field for the existing registration
//           existingRegistration.attendance = attendance;
//           existingRegistration.attendanceDate = attendanceDate; // Set attendance date

//           // Save the updated registration document
//           await existingRegistration.save();
//         } else {
//           // Handle case where registration doesn't exist
//           console.error(
//             `Registration not found for roll number: ${rollNumber}`
//           );
//           // You might choose to return an error response in this case
//         }
//       })
//     );

//     // Respond with success message
//     res.status(200).json({ message: "Attendance data saved successfully" });
//   } catch (error) {
//     console.error("Error saving attendance data:", error);
//     res.status(500).json({ error: "An unexpected error occurred" });
//   }
// };

const saveAttendanceController = async (req, res) => {
  try {
    const { updatedAttendances } = req.body;

    // Loop through each attendance record and update the database
    await Promise.all(
      updatedAttendances.map(async (attendanceRecord) => {
        const { rollNumber, attendance } = attendanceRecord;

        // Find the registration document for the given roll number
        const registration = await registerModel.findOne({ rollNumber });

        if (!registration) {
          console.error(
            `Registration not found for roll number: ${rollNumber}`
          );
          // You can choose to return an error response here if needed
          return;
        }

        // Loop through each attendance record in the array
        attendance.forEach((record) => {
          const { date, status } = record;

          // Check if an attendance record for the given date already exists
          const existingAttendanceIndex = registration.attendance.findIndex(
            (record) =>
              record.date.toISOString() === new Date(date).toISOString()
          );

          if (existingAttendanceIndex !== -1) {
            // Update the status if an attendance record already exists for the given date
            registration.attendance[existingAttendanceIndex].status = status;
          } else {
            // Otherwise, create a new attendance record
            registration.attendance.push({ date, status });
          }
        });

        // Save the updated registration document
        await registration.save();
      })
    );

    // Respond with success message
    res.status(200).json({ message: "Attendance data saved successfully" });
  } catch (error) {
    console.error("Error saving attendance data:", error);
    // Handle any errors and send an appropriate response
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const updateAttendanceController = async (req, res) => {
  try {
    // Assuming req.body contains the updated registration object
    const updatedRegistration = req.body.registration;

    // Find the registration document in the database
    const existingRegistration = await registerModel.findOne({
      rollNumber: updatedRegistration.rollNumber,
      // Add any other conditions if necessary to uniquely identify a registration
    });

    if (existingRegistration) {
      // Update the attendance field for the existing registration
      existingRegistration.attendance = updatedRegistration.attendance;

      // Save the updated registration document
      await existingRegistration.save();

      // Respond with success message
      res.status(200).json({ message: "Attendance updated successfully" });
    } else {
      // Handle case where registration doesn't exist
      console.error(
        `Registration not found for roll number: ${updatedRegistration.rollNumber}`
      );
      // Return an error response
      res.status(404).json({ error: "Registration not found" });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const registeredController = async (req, res) => {
  try {
    const { courseId } = req.params; // Extract courseId from req.params
    const { rollNumber } = req.body; // Extract rollNumber from req.body

    // Find a registration document with the given courseId and rollNumber
    const user = await registerModel.findOne({
      courseId: courseId, // Use courseId extracted from req.params
      rollNumber: rollNumber, // Use rollNumber extracted from req.body
    });

    if (!user) {
      return res.status(203).json({
        success: false,
        message: "Not registered",
      });
    }

    // If user is found, they are already registered
    return res.status(200).json({
      success: true,
      message: "Already registered",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({
      success: false,
      message: "Error",
      error: error.message, // Return the error message for debugging purposes
    });
  }
};

const markAttendanceController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rollNumber, attendanceDate, status } = req.body;

    // Find the registration document for the specified course and roll number
    const registration = await registerModel.findOne({
      courseId: courseId,
      rollNumber: rollNumber,
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if attendance record for the given date already exists
    const existingAttendanceRecord = registration.attendance.find(
      (record) =>
        record.date.toDateString() === new Date(attendanceDate).toDateString()
    );

    if (existingAttendanceRecord) {
      return res
        .status(400)
        .json({ message: "Attendance for this date already marked" });
    }

    // Create a new attendance record
    registration.attendance.push({
      date: attendanceDate,
      status: status,
    });

    // Save the updated registration document
    await registration.save();

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = {
  registrationCourse,
  registeredController,
  getAllRegistrations,
  getEachController,
  saveAttendanceController,
  updateAttendanceController,
  markAttendanceController,
};
