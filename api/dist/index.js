"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const assessmentRoutes_1 = __importDefault(require("./routes/assessmentRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const statisticsRoutes_1 = __importDefault(require("./routes/statisticsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config({ path: `${__dirname}/../.env` });
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
// Serve static files
app.use('/uploads', express_1.default.static('uploads'));
// Add this before your routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/assessments', assessmentRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/statistics', statisticsRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use(errorHandler_1.errorHandler);
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
