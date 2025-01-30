"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const assessmentController_1 = require("../controllers/assessmentController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Get all subjects (no ID conflict)
router.get('/subjects', auth_1.auth, assessmentController_1.getSubjects);
// Get all practice sessions (no ID conflict)
router.get('/practice-sessions', auth_1.auth, assessmentController_1.getPracticeSessions);
// Routes with ID parameter - specific to general
router.get('/:id/results', auth_1.auth, assessmentController_1.getResults);
router.get('/:id/questions', auth_1.auth, assessmentController_1.getQuestions);
router.post('/:id/submit', auth_1.auth, assessmentController_1.submitPractice);
// Upload route (no ID conflict)
router.post('/upload', auth_1.auth, upload_1.upload.single('document'), assessmentController_1.uploadAssessment);
// General assessment routes
router.get('/', auth_1.auth, assessmentController_1.getAssessments);
router.get('/:id', auth_1.auth, assessmentController_1.getAssessment);
exports.default = router;
