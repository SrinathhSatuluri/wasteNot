const express = require('express');
const router = express.Router();
const { createDonation, getDonations, claimDonation, getMyDonations, deleteDonation, getMyPickups, completePickup } = require('../controllers/donationController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Donor creates a donation
router.post('/', auth, authorizeRoles('donor'), createDonation);

// Anyone authenticated can view available donations
router.get('/', auth, getDonations);

// Agency/Volunteer claims a donation
router.put('/:id/claim', auth, authorizeRoles('agency', 'volunteer'), claimDonation);

// Donor gets their own donations
router.get('/my', auth, authorizeRoles('donor'), getMyDonations);

// Donor deletes their donation
router.delete('/:id', auth, authorizeRoles('donor'), deleteDonation);

// Volunteer gets their claimed pickups
router.get('/my-pickups', auth, authorizeRoles('volunteer'), getMyPickups);

// Volunteer completes a pickup
router.put('/:id/complete', auth, authorizeRoles('volunteer'), completePickup);

module.exports = router;