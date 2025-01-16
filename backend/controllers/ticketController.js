import Ticket from '../models/ticket.js';

// Create ticket (Seller only)
export const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    
    if (!req.seller?.id) {
      return res.status(400).json({
        success: false,
        message: 'Seller information is required'
      });
    }

    const ticket = new Ticket({
      subject,
      description,
      category,
      priority: priority || 'medium',
      seller: req.seller.id
    });

    await ticket.save();
    const populatedTicket = await ticket.populate('seller', 'shopName email');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: populatedTicket
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({
      success: false,
      message: error.name === 'ValidationError' ? 'Invalid ticket data provided' : 'Failed to create ticket',
      error: error.message
    });
  }
};

// Get all tickets by seller ID (Seller only)
export const getAllTicketsBySellerId = async (req, res) => {  
  try {   
    if (!req.seller?.id) {
      console.log("No seller ID found in request");
      return res.status(400).json({
        success: false,
        message: 'Seller information is required'
      });
    }
    
    const tickets = await Ticket.find({ seller: req.seller.id })
      .populate('seller', 'shopName email proprietorName phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

// Get all tickets (Public route)
export const getAllTickets = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      search,
      startDate,
      endDate 
    } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate('seller', 'shopName email proprietorName phoneNumber')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Ticket.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page: Number(page),
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Fetch tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message
    });
  }
};

// Get ticket by ID (Public route)
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('seller', 'shopName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message
    });
  }
};

// Add response (Admin only)
export const addResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Response message is required'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          responses: {
            message: message.trim(),
            from: 'admin',
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('seller', 'shopName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

// Update ticket status (Admin only)
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['open', 'pending', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('seller', 'shopName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: error.message
    });
  }
};

// Update priority (Admin only)
export const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    ).populate('seller', 'shopName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket priority updated successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket priority',
      error: error.message
    });
  }
};

// Close ticket (Admin only)
export const closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'closed',
        $push: { 
          responses: {
            message: 'Ticket closed by admin',
            from: 'admin',
            timestamp: new Date()
          }
        }
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate('seller', 'shopName email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close ticket',
      error: error.message
    });
  }
};