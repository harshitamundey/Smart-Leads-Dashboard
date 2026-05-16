"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_validator_1 = require("../validators/auth.validator");
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validation = auth_validator_1.registerSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0]?.message || 'Validation error',
        });
    }
    const { name, email, password, role } = validation.data;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'User already exists',
        });
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
        role: role,
    });
    if (user) {
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, jwt_1.generateToken)(user._id.toString()),
            },
        });
    }
    else {
        res.status(400).json({
            success: false,
            message: 'Invalid user data',
        });
    }
});
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validation = auth_validator_1.loginSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0]?.message || 'Validation error',
        });
    }
    const { email, password } = validation.data;
    const user = await User_1.default.findOne({ email });
    if (user && (await user.comparePassword(password))) {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: (0, jwt_1.generateToken)(user._id.toString()),
            },
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }
});
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.default.findById(req.user._id).select('-password');
    if (user) {
        res.json({
            success: true,
            data: user,
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
});
