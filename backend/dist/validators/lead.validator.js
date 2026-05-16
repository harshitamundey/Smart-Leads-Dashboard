"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    status: zod_1.z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: zod_1.z.enum(['Website', 'Instagram', 'Referral']),
});
exports.updateLeadSchema = exports.createLeadSchema.partial();
