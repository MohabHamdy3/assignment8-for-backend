import userModel from "../../DB/models/user.model.js";
import bcrypt from 'bcrypt';
import CryptoJS  from "crypto-js";
import jwt from "jsonwebtoken";
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone, age } = req.body;
    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
        status: 400,
      });
    }
    
    // Check if user email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        status: 400,
      });
    }
    
    // // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // // Encrypt the phone number
    const encryptedPhone = CryptoJS.AES.encrypt(phone, "mohab").toString();
    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password : hashedPassword,
      phone: encryptedPhone,
      age,
    });

    return res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: newUser,
    });
  } catch (error) {
    
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};


export const loginUser = async (req, res, next) => {
  try{
    const { email, password } = req.body;
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
      });
    }
    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: 400,
      });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "mohab", { expiresIn: "1h" });
    return res.status(200).json({
      message: "Login successful",
      status: 200,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};



export const updateLoggedInUser = async (req, res, next) => {
  try{
    const updates= {...req.body};
    // check if password is provided
    if ("password" in updates || "confirmPassword" in updates) {
      return res.status(400).json({
        message: "You cannot update password using this endpoint",
        status: 400,
      });
    }

    // Find user by id
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    // Check if email is provided and if it has changed
    if (updates.email && updates.email !== user.email) {
      // Check if new email already exists
      const existingUser = await userModel.findOne({ email: updates.email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already in use",
          status: 400,
        });
      }
      // encrypt the new phone number
      if (updates.phone) {
        updates.phone = CryptoJS.AES.encrypt(updates.phone, "mohab").toString();
  }
    // Update user details
    user.name = updates.name || user.name;
    user.email = updates.email || user.email;
    user.phone = updates.phone || user.phone;
    user.age = updates.age || user.age;

    // Save updated user
    const updatedUser = await user.save();
    
    return res.status(200).json({
      message: "User updated successfully",
      status: 200,
      data: updatedUser,
    });
  }
 }
  catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
}
}

export const deleteLoggedInUser = async (req, res, next) => {
  try {
    // Find user by id
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    // Delete user
    await userModel.findByIdAndDelete(req.user.id);
    return res.status(200).json({
      message: "User deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

export const getLoggedInUser = async (req, res, next) => {
  try {
    // Find user by id
    const user = await userModel.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    // Return user details
    return res.status(200).json({
      message: "User retrieved successfully",
      status: 200,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        age: user.age,
      },

    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
}