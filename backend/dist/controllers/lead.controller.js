"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadStats = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const asyncHandler_1 = require("../utils/asyncHandler");
const lead_validator_1 = require("../validators/lead.validator");
// @desc    Get all leads with filtering, search, and pagination
// @route   GET /api/leads
// @access  Private
exports.getLeads = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status, source, search, sort, page = 1, limit = 10 } = req.query;
    // Build query
    const query = {};
    if (status) {
        query.status = status;
    }
    if (source) {
        query.source = source;
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === 'oldest') {
        sortQuery = { createdAt: 1 };
    }
    const leads = await Lead_1.default.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum);
    const total = await Lead_1.default.countDocuments(query);
    res.json({
        success: true,
        message: 'Leads fetched successfully',
        data: leads,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
        },
    });
});
// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLeadById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lead = await Lead_1.default.findById(req.params.id);
    if (lead) {
        res.json({
            success: true,
            data: lead,
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: 'Lead not found',
        });
    }
});
// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
exports.createLead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validation = lead_validator_1.createLeadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0]?.message || 'Validation error',
        });
    }
    const lead = await Lead_1.default.create(validation.data);
    res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: lead,
    });
});
// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validation = lead_validator_1.updateLeadSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0]?.message || 'Validation error',
        });
    }
    const lead = await Lead_1.default.findByIdAndUpdate(req.params.id, validation.data, {
        new: true,
        runValidators: true,
    });
    if (lead) {
        res.json({
            success: true,
            message: 'Lead updated successfully',
            data: lead,
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: 'Lead not found',
        });
    }
});
// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
exports.deleteLead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lead = await Lead_1.default.findById(req.params.id);
    if (lead) {
        await lead.deleteOne();
        res.json({
            success: true,
            message: 'Lead removed',
        });
    }
    else {
        res.status(404).json({
            success: false,
            message: 'Lead not found',
        });
    }
});
// @desc    Get dashboard analytics
// @route   GET /api/leads/stats
// @access  Private
exports.getLeadStats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const stats = await Lead_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                newLeads: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
                qualifiedLeads: { $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] } },
                lostLeads: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
            },
        },
    ]);
    const defaultStats = {
        totalLeads: 0,
        newLeads: 0,
        qualifiedLeads: 0,
        lostLeads: 0,
    };
    res.json({
        success: true,
        data: stats.length > 0 ? stats[0] : defaultStats,
    });
});
