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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});
// Update the name virtual getter
userSchema.virtual("name").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Hash password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        try {
            const salt = yield bcrypt_1.default.genSalt(10);
            this.password = yield bcrypt_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(candidatePassword, this.password);
    });
};
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return resetToken;
};
exports.default = mongoose_1.default.model("User", userSchema);
