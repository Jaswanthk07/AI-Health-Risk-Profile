const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true, unique: true },
  answers: { type: Object, default: {} },
  patientInfo: { 
    type: Object, 
    default: {},
    name: String,
    age: Number,
    gender: String,
    phone: String,
    email: String,
    address: String
  },
  risk_level: { type: String, enum: ['low', 'medium', 'high'], default: null },
  score: { type: Number, default: null },
  recommendations: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
}, { collection: 'user_profiles' });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
