const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(cors({
  origin: ["https://stringz-lijo.vercel.app", process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Stringz API" });
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Error Handler (must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
