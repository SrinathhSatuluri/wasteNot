const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: String,


  quantity: { type: String, required: true },
    pickupTime: { type: Date, required: true },
    location: { type: String, required: true },
  status: { type: String, enum: ['available', 'claimed', 'completed'], default: 'available' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });






module.exports = mongoose.model('Donation', DonationSchema);