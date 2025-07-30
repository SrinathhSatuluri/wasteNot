const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  items: [{ type: String, required: true }], // Array of specific food items needed
  quantity: { type: String, required: true },
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  deadline: { type: Date, required: true },
  location: { type: String, required: true },
  // Enhanced location with GPS coordinates
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  },
  status: { 
    type: String, 
    enum: ['open', 'partially_fulfilled', 'fulfilled', 'expired'], 
    default: 'open' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fulfilledBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Multiple donors can fulfill parts
  notes: String, // Additional notes from the agency
}, { timestamps: true });

// Create geospatial index for location-based queries
RequestSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Request', RequestSchema); 