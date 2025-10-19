import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: 'text' // Text index for search
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    index: 'text' // Text index for search
  },
  images: [{
    type: String
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    index: true // Index for price sorting and filtering
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    validate: {
      validator: function (v) {
        return !v || v >= this.price;
      },
      message: 'Original price must be greater than or equal to current price'
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    index: true // Index for category filtering
  },
  brand: {
    type: String,
    trim: true,
    index: 'text' // Text index for search
  },
  specifications: [{
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  }],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor is required'],
    index: true // Index for vendor queries
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'pending', 'draft'],
    default: 'active',
    index: true // Index for status filtering
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  views: { type: Number, default: 0, min: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting by date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for common queries
ProductSchema.index({ status: 1, category: 1 }); // For category filtering with status
ProductSchema.index({ status: 1, price: 1 }); // For price sorting with status
ProductSchema.index({ status: 1, createdAt: -1 }); // For recent products
ProductSchema.index({ vendor: 1, status: 1 }); // For vendor's products
ProductSchema.index({ category: 1, price: 1 }); // For category + price filtering
ProductSchema.index({ 'ratings.average': -1, status: 1 }); // For top-rated products

// Text index for full-text search
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text'
}, {
  weights: {
    name: 10,
    brand: 5,
    category: 3,
    description: 1
  }
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for availability status
ProductSchema.virtual('isAvailable').get(function () {
  return this.status === 'active' && this.quantity > 0;
});

// Virtual for formatted price
ProductSchema.virtual('formattedPrice').get(function () {
  return `PKR ${this.price.toLocaleString()}`;
});

// Instance method to increment views
ProductSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to get featured products
ProductSchema.statics.getFeatured = function (limit = 10) {
  return this.find({
    status: 'active',
    quantity: { $gt: 0 },
    'ratings.average': { $gte: 4 }
  })
    .sort({ 'ratings.average': -1, views: -1 })
    .limit(limit)
    .populate('vendor', 'username email');
};

// Static method to get trending products
ProductSchema.statics.getTrending = function (limit = 10) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.find({
    status: 'active',
    quantity: { $gt: 0 },
    createdAt: { $gte: thirtyDaysAgo }
  })
    .sort({ views: -1, 'ratings.average': -1 })
    .limit(limit)
    .populate('vendor', 'username email');
};

// Pre-save middleware to update timestamps
ProductSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate images array length
ProductSchema.pre('save', function (next) {
  if (this.images && this.images.length > 10) {
    return next(new Error('Cannot have more than 10 images'));
  }
  next();
});

// Pre-save middleware to ensure originalPrice is valid
ProductSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice < this.price) {
    this.originalPrice = this.price;
  }
  next();
});

export default mongoose.model('Product', ProductSchema); 