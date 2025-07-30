const Donation = require('../models/Donation');

// Create a new donation (Donor only)
exports.createDonation = async (req, res) => {
  try {
    const { title, description, quantity, pickupTime, location, latitude, longitude } = req.body;
    if (!title || !quantity || !pickupTime || !location) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    const donationData = {
      title,
      description,
      quantity,
      pickupTime,
      location,
      createdBy: req.user._id,
    };
    
    // Add coordinates if provided
    if (latitude && longitude) {
      donationData.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }
    
    const donation = new Donation(donationData);
    await donation.save();
    
    // Send real-time notification to volunteers and agencies
    const io = req.app.get('io');
    if (io) {
      io.to('volunteer').to('agency').emit('new-donation', {
        type: 'new-donation',
        message: `New donation available: ${title}`,
        donation: {
          id: donation._id,
          title: donation.title,
          location: donation.location,
          quantity: donation.quantity,
          pickupTime: donation.pickupTime
        }
      });
    }
    
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all available donations with optional location-based filtering
exports.getDonations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km
    
    let query = { status: 'available' };
    
    // If coordinates provided, add location-based filtering
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const maxDistance = parseFloat(radius) * 1000; // Convert km to meters
      
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: maxDistance
        }
      };
    }
    
    const donations = await Donation.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
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
    
    // Send real-time notification to donor
    const io = req.app.get('io');
    if (io) {
      io.to('donor').emit('donation-claimed', {
        type: 'donation-claimed',
        message: `Your donation "${donation.title}" has been claimed!`,
        donation: {
          id: donation._id,
          title: donation.title,
          claimedBy: req.user.name
        }
      });
    }
    
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user's own donations (Donor only)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a donation (Donor only)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }
    
    // Check if user owns this donation
    if (donation.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this donation.' });
    }
    
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get volunteer's claimed donations
exports.getMyPickups = async (req, res) => {
  try {
    const pickups = await Donation.find({ 
      claimedBy: req.user._id,
      status: { $in: ['claimed', 'completed'] }
    })
      .populate('createdBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ pickupTime: 1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Complete a pickup (Volunteer only)
exports.completePickup = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }
    
    // Check if user claimed this donation
    if (donation.claimedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this pickup.' });
    }
    
    donation.status = 'completed';
    await donation.save();
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};