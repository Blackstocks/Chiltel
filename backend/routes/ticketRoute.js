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
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/list', getAllTickets);
router.get('/get/:id', getTicketById);
router.put('/:id/status', adminAuth, updateTicketStatus);
router.post('/:id/response', adminAuth, addResponse);
router.put('/:id/priority', adminAuth, updatePriority);
router.put('/:id/close', adminAuth, closeTicket);

router.use(protectSeller);
router.post('/create', createTicket);
router.get('/mytickets', getAllTicketsBySellerId);


export default router;