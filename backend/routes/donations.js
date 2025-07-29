const express = require('express');
const router = express.Router();
const { createDonation, getDonations, claimDonation } = require('../controllers/donationController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Donor creates a donation
router.post('/', auth, authorizeRoles('donor'), createDonation);

// Anyone authenticated can view available donations
router.get('/', auth, getDonations);

// Agency/Volunteer claims a donation
router.post('/:id/claim', auth, authorizeRoles('agency', 'volunteer'), claimDonation);

module.exports = router;