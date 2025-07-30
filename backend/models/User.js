const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'volunteer', 'agency'], required: true },
  // Social login fields
  googleId: { type: String, sparse: true },
  facebookId: { type: String, sparse: true },
  appleId: { type: String, sparse: true },
  // Volunteer-specific fields
  phone: { type: String },
  location: { type: String },
  availability: { type: String, default: 'Flexible' },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  completedPickups: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);