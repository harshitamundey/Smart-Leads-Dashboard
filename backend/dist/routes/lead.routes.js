"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.get('/', lead_controller_1.getLeads);
router.get('/stats', lead_controller_1.getLeadStats);
router.get('/:id', lead_controller_1.getLeadById);
router.post('/', lead_controller_1.createLead);
router.put('/:id', lead_controller_1.updateLead);
router.delete('/:id', (0, auth_middleware_1.authorize)('Admin'), lead_controller_1.deleteLead);
exports.default = router;
