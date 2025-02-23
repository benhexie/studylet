"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// Public routes
router.post('/login', adminController_1.adminLogin);
// Protected admin routes
router.use(auth_1.auth, adminAuth_1.adminAuth);
router.post('/assessments', adminController_1.createAssessment);
router.get('/assessments', adminController_1.getAssessments);
router.delete('/assessments/:id', adminController_1.deleteAssessment);
router.get('/stats', adminController_1.getAdminStats);
exports.default = router;
