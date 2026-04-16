import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  items: [{
    description: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  date: { type: Date, default: Date.now },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
