// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  area: String,
  location: String,
  price: String,
  description: String,
  images: [String],
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', propertySchema);