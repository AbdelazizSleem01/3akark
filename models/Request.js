// models/Request.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  whatsapp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  }
}, { 
  timestamps: true 
});

// Check if the model already exists before creating it
const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;