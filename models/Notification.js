// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
   message: { type: String },
  isRead: { type: Boolean, default: false }
});

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
