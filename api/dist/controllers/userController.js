"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const stream_1 = require("stream");
const bufferToStream = (buffer) => {
    const readable = new stream_1.Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
    return readable;
};
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = {};
        const allowedUpdates = ['name', 'email', 'studentId'];
        // Handle text fields
        allowedUpdates.forEach(field => {
            if (req.body[field])
                updates[field] = req.body[field];
        });
        // Handle avatar file
        if (req.file) {
            try {
                // Upload to Cloudinary
                const stream = cloudinary_1.default.uploader.upload_stream({
                    folder: 'avatars',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ],
                }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        return res.status(500).json({ message: 'Image upload failed' });
                    }
                    updates.avatar = result === null || result === void 0 ? void 0 : result.secure_url;
                    // Update user with all changes including avatar
                    const user = yield User_1.default.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    res.json(user);
                }));
                bufferToStream(req.file.buffer).pipe(stream);
            }
            catch (error) {
                res.status(500).json({ message: 'Image upload failed' });
            }
        }
        else {
            // Update user without avatar
            const user = yield User_1.default.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true }).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
