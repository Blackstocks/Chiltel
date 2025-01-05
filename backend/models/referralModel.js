// models/referralCode.model.js
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Document will be automatically deleted after 24 hours (86400 seconds)
  }
});

const ReferralCode = mongoose.model('ReferralCode', referralSchema);
export default ReferralCode;