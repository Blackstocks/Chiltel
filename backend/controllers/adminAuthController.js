import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Register a user
export const register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;

    if (!username || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      phoneNumber,
      role,
    });

    if (!admin) {
      return res.status(500).json({ message: "Failed to create admin" });
    }

    res.status(201).json({
      message: "Admin created successfully",
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Admin.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        message: "Login successful",
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { username, email, phoneNumber, currentPassword, newPassword } =
      req.body;

    const admin = await Admin.findById(req.admin.id);

    // Verify current password if trying to change password
    if (newPassword) {
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      admin.password = newPassword;
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.phoneNumber = phoneNumber || admin.phoneNumber;

    await admin.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sub-admins
export const getSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Admin.find({ role: "sub-admin" }).select(
      "-password"
    );
    res.json(subAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sub-admin
export const getSubAdmin = async (req, res) => {
  try {
    const subAdmin = await Admin.findById(req.params.id).select("-password");
    if (!subAdmin)
      return res.status(404).json({ message: "Sub-admin not found" });
    res.json(subAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete sub-admin
export const deleteSubAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Sub-admin not found" });
    res.json({ message: "Sub-admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
