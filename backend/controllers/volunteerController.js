const User = require('../models/User');

// Get all volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get volunteer by ID
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await User.findById(req.params.id)
      .select('-password');
    
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ message: 'Volunteer not found.' });
    }
    
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update volunteer availability
exports.updateVolunteerAvailability = async (req, res) => {
  try {
    const { isAvailable, availability } = req.body;
    
    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      { 
        isAvailable: isAvailable || false,
        availability: availability || 'Flexible'
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ message: 'Volunteer not found.' });
    }
    
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get volunteer statistics
exports.getVolunteerStats = async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const availableVolunteers = await User.countDocuments({ 
      role: 'volunteer', 
      isAvailable: true 
    });
    
    res.json({
      total: totalVolunteers,
      available: availableVolunteers,
      busy: totalVolunteers - availableVolunteers
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 