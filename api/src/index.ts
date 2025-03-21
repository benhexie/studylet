import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler } from "./middleware/errorHandler";
import passport from "./config/passport";
import morgan from "morgan";
dotenv.config({ path: `${__dirname}/../.env` });

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://studylet.vercel.app",
  "https://studylet-api.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000"
];

// Move passport initialization to the top, before CORS
app.use(passport.initialize());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error(
            `CORS Policy Error - Unauthorized Domain. Origin - ${origin}`,
          ),
        );
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Other Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Add this before your routes
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Studylet!");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler as any);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
