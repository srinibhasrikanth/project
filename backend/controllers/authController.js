const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const { hashPassword, comparePassword } = require("../helper/authHelper.js");
const adminModel = require("../models/adminModel.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// controllers/authController.js

const fs = require("fs");
const path = require("path");

// Path to the deletedusers.js file
const deletedUsersFilePath = path.join(__dirname, "..", "deletedusers.js");

// Function to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Perform deletion logic here (e.g., delete user from the database)

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

// Function to add a deleted user to deletedusers.js
exports.addDeletedUser = async (req, res) => {
  try {
    const userData = req.body;

    // Read the current contents of deletedusers.js
    let deletedUsers = require(deletedUsersFilePath);

    // Add the deleted user's data to deletedusers.js
    deletedUsers.push(userData);

    // Write the updated data back to deletedusers.js
    fs.writeFileSync(deletedUsersFilePath, JSON.stringify(deletedUsers));

    res.status(200).json({
      success: true,
      message: "Deleted user added to deletedusers.js",
    });
  } catch (error) {
    console.error("Error adding deleted user:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding deleted user" });
  }
};
//user signup
const registerController = async (req, res) => {
  try {
    const formData = req.body;

    // // Check if formData exists
    // if (!formData) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Form data is missing",
    //   });
    // }

    // Check if user already exists
    const existingUser = await userModel.findOne({
      rollNumber: formData.rollNumber,
    });
    if (existingUser) {
      return res.status(403).send({
        success: false,
        message: "User already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(formData.password);
    formData.password = hashedPassword;
    console.log(formData);
    // Create new user
    const user = new userModel({
      ...formData,
    });
    console.log(user);
    await user.save();
    // Send registration email
    sendRegistrationEmail(user.personalEmail, user.name);
    res.status(200).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

//admin signup
const registerAdminController = async (req, res) => {
  try {
    const { username, personalEmail, password, confirmPassword } = req.body;
    //validations

    //check user
    const exisitingUser = await adminModel.findOne({ username });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }
    if (password === confirmPassword) {
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new adminModel({
        username,
        personalEmail,
        password: hashedPassword,
      }).save();

      // Send registration email
      sendRegistrationEmail(user.personalEmail);

      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });
    } else {
      res.status(203).send({
        success: false,
        message: "Passwords do not match",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//userlogin
const loginController = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    //validation
    if (!rollNumber || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ rollNumber });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      rollNumber,
      token,
      _id: user._id,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//admin login
const loginAdminController = async (req, res) => {
  try {
    const { username, password } = req.body;
    //validation
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await adminModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        user,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Function to send registration email
const sendRegistrationEmail = async (userEmail, username) => {
  // create reusable transporter object using the default SMTP transport
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

    Dear ${username},

    Welcome to VNRVJIET TRAINING! We are thrilled to have you on board, and we appreciate the trust you have placed in us. Your account registration is now complete, and you are all set to explore the exciting features and services we have to offer.

    Here are a few key details about your account:

    Username: ${username}
    Email Address: ${userEmail}

    To get started, you can log in to your account using the following link: http://localhost:3000
    Once logged in, you'll be able to:

    - Access and manage your profile information
    - Explore our wide range of products/services
    - Place orders and track their status
    - Stay updated on promotions, news, and important announcements

    If you have any questions or need assistance, our customer support team is here to help. Feel free to reach out to us at Customer Support.

    Thank you for choosing VNRVJIET TRAINING. We look forward to serving you and providing you with a seamless and enjoyable experience.

    Best regards,

    S Murali Mohan
    VNRVJIET TRAINING
    +91 9440339219
  `;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "srinibha.srikanth@gmail.com",
    to: userEmail,
    subject:
      "Welcome to VNRVJIET TRAINING - Your Account Registration is Complete!",
    text: emailBody,
  });

  console.log("Email sent: %s", info.messageId);
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from request body
    const user = await userModel.findOne({ personalEmail: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5min",
    });
    sendForgotPasswordMail(user.personalEmail, user.name, token, user._id);
    return res.status(200).json({
      success: true,
      message: "Successfully sent email",
    });
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendForgotPasswordMail = async (userEmail, username, token, id) => {
  // create reusable transporter object using the default SMTP transport
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

  Dear ${username},

  You recently requested to reset your password for your account. To reset your password, please click on the link below:
  
  http://localhost:3000/reset-password/${id}/${token}

  This link will be expired in 5 minutes.
  
  If you did not request a password reset, please ignore this email.
  
  Thank you,
  VNRVJIET Team
  
  `;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "srinibha.srikanth@gmail.com",
    to: userEmail,
    subject: "RESET YOUR PASSWORD ",
    text: emailBody,
  });

  console.log("Email sent: %s", info.messageId);
};

// const resetPasswordController = async (req, res) => {
//   const { id, token } = req.params;
//   const { newPassword } = req.body;
//   JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.json({ Status: "Error with token" });
//     } else {
//       bcrypt
//         .hash(newPassword, 10)
//         .then((hash) => {
//           userModel
//             .findByIdAndUpdate({ _id: id }, { newPassword: hash })
//             .then((u) => res.status(200).send({ Status: "Success" }))
//             .catch((err) => res.send({ Status: err }));
//         })
//         .catch((err) => res.send({ Status: err }));
//     }
//   });
// };
const resetPasswordController = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    // Check if newPassword is provided and not empty
    if (!newPassword) {
      return res.status(400).json({ error: "Invalid newPassword" });
    }

    // Verify the JWT token
    JWT.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token" });
      }

      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Pass newPassword and saltRounds (10) as arguments

        // Update the user's password in the database
        await userModel.findByIdAndUpdate(id, { password: hashedPassword });

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
const razorPayController = async (req, res) => {
  try {
    // Create Razorpay order
    const order = await rzp.orders.create({
      amount: req.body.amount,
      currency: "INR",
      payment_capture: 1,
    });

    // Send order ID and amount to frontend
    res.json({
      id: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay payment error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const reg = await userModel.find({});
    res.status(200).json(reg);
  } catch (error) {
    res.status(500).json({ error: "Error in getting all users" });
  }
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteIconController = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Update the user's delete flag to 1
    await userModel.findByIdAndUpdate(userId, { delete: 1 });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const dynamicCounterController = async (req, res) => {
  try {
    const count = await userModel.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  registerController,
  deleteUserController,
  loginController,
  registerAdminController,
  loginAdminController,
  forgotPasswordController,
  resetPasswordController,
  razorPayController,
  getAllUsersController,
  deleteIconController,
  dynamicCounterController,
};
