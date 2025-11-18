const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";



// ✅ ADD THIS PART — FIXES YOUR CORS ERROR
app.use(cors({
    origin: "http://localhost:4000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  }));

// --------------------
// CONNECT MONGODB ATLAS
// --------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --------------------
// USER SCHEMA (name, email, password)
// --------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// --------------------
// AUTH MIDDLEWARE
// --------------------
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
}

// --------------------
// DEFAULT ROUTE
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Authentication API" });
});

// --------------------
// POST /api/signup
// --------------------
app.post("/api/signup", async (req, res) => {
  
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// --------------------
// POST /api/login
// --------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
});



// --------------------
// POST /api/logout
// --------------------
app.post("/api/logout", (req, res) => {
  // Stateless logout — frontend should delete token
  return res.status(200).json({ message: "Logout successful" });
});



app.get("/api/users", (req, res) => {
    User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching users", error: err.message });
    }
    return res.status(200).json(users);
  });
});
// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
