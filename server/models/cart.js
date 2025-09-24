import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  priceAtTimeOfAdding: { 
    type: Number, 
    required: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure a user can't add the same product twice
CartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Cart', CartSchema); 