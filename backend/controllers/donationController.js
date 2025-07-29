const Donation = require('../models/Donation');

// Create a new donation (Donor only)
exports.createDonation = async (req, res) => {
  try {
    const { title, description, quantity, pickupTime, location } = req.body;
    if (!title || !quantity || !pickupTime || !location) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    const donation = new Donation({
      title,
      description,
      quantity,
      pickupTime,
      location,
      createdBy: req.user._id,
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all available donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' }).populate('createdBy', 'name email');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Claim a donation (Agency/Volunteer)
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation || donation.status !== 'available') {
      return res.status(404).json({ message: 'Donation not available.' });
    }
    donation.status = 'claimed';
    donation.claimedBy = req.user._id;
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};