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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = __importDefault(require("../models/User"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        // Find existing user
        let user = yield User_1.default.findOne({ email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value });
        if (user) {
            return done(null, user);
        }
        // Create new user if doesn't exist
        user = yield User_1.default.create({
            firstName: ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName) || "",
            lastName: ((_c = profile.name) === null || _c === void 0 ? void 0 : _c.familyName) || "",
            email: (_d = profile.emails) === null || _d === void 0 ? void 0 : _d[0].value,
            password: Math.random().toString(36).slice(-8), // Random password
            avatar: (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0].value,
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
exports.default = passport_1.default;
