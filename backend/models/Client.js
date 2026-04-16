import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
