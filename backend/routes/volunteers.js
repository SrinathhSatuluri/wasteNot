const express = require('express');
const router = express.Router();
const { 
  getVolunteers, 
  getVolunteerById, 
  updateVolunteerAvailability, 
  getVolunteerStats 
} = require('../controllers/volunteerController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Get all volunteers (Agency only)
router.get('/', auth, authorizeRoles('agency'), getVolunteers);

// Get volunteer statistics (Agency only)
router.get('/stats', auth, authorizeRoles('agency'), getVolunteerStats);

// Get specific volunteer (Agency only)
router.get('/:id', auth, authorizeRoles('agency'), getVolunteerById);

// Update volunteer availability (Volunteer can update their own, Agency can update any)
router.put('/:id/availability', auth, updateVolunteerAvailability);

module.exports = router; 