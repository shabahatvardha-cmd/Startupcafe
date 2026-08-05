import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'N/A'
  },
  budget: {
    type: String,
    default: 'N/A'
  },
  message: {
    type: String
  },
  source: {
    type: String,
    default: 'Franchise Inquiry Form'
  },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Franchise = mongoose.model('Franchise', franchiseSchema);
export default Franchise;
