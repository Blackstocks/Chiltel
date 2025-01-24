// routes/ticketRoutes.js
import express from 'express';
import { 
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  addResponse,
  updatePriority,
  closeTicket,
  getAllTicketsBySellerId,
} from '../controllers/ticketController.js';
import { protectSeller } from '../middleware/sellerAuth.js';
import { protect, authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.get('/list', getAllTickets);
router.get('/get/:id', getTicketById);
router.put('/:id/status', protect, authorize(['super-admin', 'sub-admin']), updateTicketStatus);
router.post('/:id/response', protect, authorize(['super-admin', 'sub-admin']), addResponse);
router.put('/:id/priority', protect, authorize(['super-admin', 'sub-admin']), updatePriority);
router.put('/:id/close', protect, authorize(['super-admin', 'sub-admin']), closeTicket);

router.use(protectSeller);
router.post('/create', createTicket);
router.get('/mytickets', getAllTicketsBySellerId);


export default router;