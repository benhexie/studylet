"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
exports.adminAuth = adminAuth;
