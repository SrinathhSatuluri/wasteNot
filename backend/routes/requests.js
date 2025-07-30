const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getRequests, 
  getMyRequests, 
  updateRequest, 
  deleteRequest, 
  fulfillRequest 
} = require('../controllers/requestController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Agency creates a request
router.post('/', auth, authorizeRoles('agency'), createRequest);

// Anyone can view open requests
router.get('/', auth, getRequests);

// Agency gets their own requests
router.get('/my', auth, authorizeRoles('agency'), getMyRequests);

// Agency updates their request
router.put('/:id', auth, authorizeRoles('agency'), updateRequest);

// Agency deletes their request
router.delete('/:id', auth, authorizeRoles('agency'), deleteRequest);

// Donor marks request as fulfilled
router.post('/:id/fulfill', auth, authorizeRoles('donor'), fulfillRequest);

module.exports = router; 