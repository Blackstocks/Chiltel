import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (email, id) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //console.log(email, password);

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user.email, user._id);
      console.log(token);
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          id: user._id,
          email: user.email,
          name: user.name, // Assuming you store the user's name
        },
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(email, user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Remove 'Bearer ' part
    // console.log('token: ', token);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded: ", decoded);

    // Find user by decoded token id
    const user = await userModel.findById(decoded.id).select("-password"); // Exclude password field

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    // If token is valid and user is found, send the user data
    res.status(200).json(user); // Send back user data
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export { loginUser, registerUser, verifyToken };
