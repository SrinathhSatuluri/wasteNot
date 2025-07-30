const Request = require('../models/Request');

// Create a new request (Agency only)
exports.createRequest = async (req, res) => {
  try {
    const { title, description, items, quantity, urgency, deadline, location, notes, latitude, longitude } = req.body;
    
    if (!title || !description || !items || !quantity || !deadline || !location) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const requestData = {
      title,
      description,
      items,
      quantity,
      urgency: urgency || 'medium',
      deadline,
      location,
      notes,
      createdBy: req.user._id,
    };

    // Add coordinates if provided
    if (latitude && longitude) {
      requestData.coordinates = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const request = new Request(requestData);
    await request.save();
    
    // Send real-time notification to donors
    const io = req.app.get('io');
    if (io) {
      io.to('donor').emit('new-request', {
        type: 'new-request',
        message: `New food request: ${title}`,
        request: {
          id: request._id,
          title: request.title,
          urgency: request.urgency,
          location: request.location,
          deadline: request.deadline
        }
      });
    }
    
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all open requests with optional location-based filtering
exports.getRequests = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km
    
    let query = { 
      status: { $in: ['open', 'partially_fulfilled'] },
      deadline: { $gt: new Date() } // Not expired
    };
    
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
    
    const requests = await Request.find(query)
      .populate('createdBy', 'name email')
      .populate('fulfilledBy', 'name email')
      .sort({ urgency: -1, deadline: 1 }); // Sort by urgency first, then deadline
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get agency's own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .populate('fulfilledBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update request status (Agency only)
exports.updateRequest = async (req, res) => {
  try {
    const { title, description, items, quantity, urgency, deadline, location, notes, status } = req.body;
    const requestId = req.params.id;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Check if user owns this request
    if (request.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request.' });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      {
        title,
        description,
        items,
        quantity,
        urgency,
        deadline,
        location,
        notes,
        status,
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email').populate('fulfilledBy', 'name email');

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete request (Agency only)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    // Check if user owns this request
    if (request.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this request.' });
    }
    
    await Request.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Mark request as fulfilled (Donor can mark as fulfilled when they donate)
exports.fulfillRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Add donor to fulfilledBy array if not already there
    if (!request.fulfilledBy.includes(req.user._id)) {
      request.fulfilledBy.push(req.user._id);
    }

    // Update status based on fulfillment
    if (request.fulfilledBy.length >= 1) {
      request.status = 'partially_fulfilled';
    }
    if (request.fulfilledBy.length >= 2) {
      request.status = 'fulfilled';
    }

    await request.save();
    
    const updatedRequest = await Request.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('fulfilledBy', 'name email');
    
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 