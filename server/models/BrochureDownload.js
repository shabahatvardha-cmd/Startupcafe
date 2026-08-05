import mongoose from 'mongoose';

const brochureDownloadSchema = new mongoose.Schema({
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
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BrochureDownload = mongoose.model('BrochureDownload', brochureDownloadSchema);
export default BrochureDownload;
