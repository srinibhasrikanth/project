const resourceModel = require("../models/resourceModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const createResourceController = async (req, res) => {
  try {
    const { name, email, designation, mobileNumber, id } = req.body;

    // Generate a random password
    const randomPassword = generateRandomPassword();

    // Hash the password before saving it in the database
    bcrypt.hash(randomPassword, 10, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        res.status(500).json({
          success: false,
          message: "Error hashing password",
          error: err.message,
        });
        return;
      }
      const newResource = new resourceModel({
        name,
        email,
        designation,
        mobileNumber,
        password: hash,
      });

      const saveResource = await newResource.save();

      // Send email with credentials
      await sendCredentialsEmail(
        newResource.email,
        newResource.name,
        randomPassword
      );

      res.status(200).json({
        success: true,
        message: "Successfully resource person details added",
        saveResource,
      });
    });
  } catch (error) {
    console.error("Error during creation:", error);
    res.status(403).json({
      success: false,
      message: "Something went wrong, creation unsuccessful",
      error: error.message,
    });
  }
};
const generateRandomPassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const sendCredentialsEmail = async (email, username, password) => {
  try {
    let transporter = nodemailer.createTransport({
      // Your email configuration, such as service, auth, etc.
      // Example for Gmail:
      service: "gmail",
      auth: {
        user: "srinibha.srikanth@gmail.com",
        pass: process.env.pass,
      },
    });

    const emailBody = `
      Dear ${username},
      
      Your account has been created successfully. Here are your login credentials:
      
      Username: ${email}
      Password: ${password}
      
      Please keep this information confidential and do not share it with anyone.
      
      Best regards,
      VNRVJIET
    `;

    // Send mail with defined transport object
    await transporter.sendMail({
      from: "srinibha.srikanth@gmail.com",
      to: email,
      subject: "Account Created - Login Credentials",
      text: emailBody,
    });

    console.log("Credentials email sent successfully.");
  } catch (error) {
    console.error("Error sending credentials email:", error);
    throw error; // Propagate the error to the calling function
  }
};
const resourceLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists in the database
    const user = await resourceModel.findOne({ email: username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Username not found", success: "false" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: "false" });
    }

    // If the username and password are valid, generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send the token in the response
    res.status(200).json({
      message: "Login successful",
      success: "true",
      token,
      _id: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An unexpected error occurred during login",
      success: "false",
      error: error.message,
    });
  }
};

const editResourceController = async (req, res) => {};

const deleteResourceController = async (req, res) => {};

const getResourceController = async (req, res) => {
  try {
    const resources = await resourceModel.find({});
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};
// const resetPassword = async (req, res) => {
//   const { id, token } = req.params;
//   const newPassword = req.body;

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.json({ Status: "Error with token" });
//     } else {
//       bcrypt
//         .hash(newPassword, 10)
//         .then((hash) => {
//           resourceModel
//             .findByIdAndUpdate({ _id: id }, { newPassword: hash })

//             .then(() => res.status(200).send({ Status: "Success" }))
//             .catch((err) => res.send({ Status: err }));
//         })
//         .catch((err) => res.send({ Status: err }));
//     }
//   });
// };
const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Check if newPassword is provided and not empty
    if (!newPassword) {
      return res.status(400).json({ error: "Invalid newPassword" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
      }

      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Pass newPassword and saltRounds (10) as arguments

        // Update the user's password in the database
        await resourceModel.findByIdAndUpdate(id, { password: hashedPassword });

        // Send success response
        return res.status(200).json({ message: "Password reset successful" });
      } catch (error) {
        console.error("Error hashing password or updating database:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = resetPassword;

module.exports = {
  createResourceController,
  resourceLoginController,
  editResourceController,
  deleteResourceController,
  getResourceController,
  resetPassword,
};
