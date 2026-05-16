import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { asyncHandler } from '../utils/asyncHandler';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';

// @desc    Get all leads with filtering, search, and pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort, page = 1, limit = 10 } = req.query;

  // Build query
  const query: any = {};

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
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Sorting
  let sortQuery: any = { createdAt: -1 };
  if (sort === 'oldest') {
    sortQuery = { createdAt: 1 };
  }

  const leads = await Lead.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(limitNum);

  const total = await Lead.countDocuments(query);

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
export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    res.json({
      success: true,
      data: lead,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }
});

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const validation = createLeadSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: (validation.error as any).issues[0]?.message || 'Validation error',
    });
  }

  const lead = await Lead.create(validation.data as any);

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead,
  });
});

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const validation = updateLeadSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: (validation.error as any).issues[0]?.message || 'Validation error',
    });
  }

  const lead = await Lead.findByIdAndUpdate(req.params.id, validation.data as any, {
    new: true,
    runValidators: true,
  });

  if (lead) {
    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }
});

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (lead) {
    await lead.deleteOne();
    res.json({
      success: true,
      message: 'Lead removed',
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }
});

// @desc    Get dashboard analytics
// @route   GET /api/leads/stats
// @access  Private
export const getLeadStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Lead.aggregate([
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
