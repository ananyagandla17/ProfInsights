const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfessorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  courses: [{
    type: String,
    trim: true
  }],
  email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingDetails: {
    teaching: { type: Number, default: 0 },
    knowledge: { type: Number, default: 0 },
    organization: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    helpfulness: { type: Number, default: 0 }
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for text search
ProfessorSchema.index({ 
  name: 'text', 
  department: 'text', 
  courses: 'text' 
});

// Ensure ratings are updated when a review is added/removed
ProfessorSchema.methods.updateRatings = async function(db) {
  const reviews = await db.collection('reviews').find({
    professorId: this._id
  }).toArray();
  
  this.reviewCount = reviews.length;
  
  if (reviews.length === 0) {
    this.averageRating = 0;
    this.ratingDetails = {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    };
    return;
  }
  
  // Calculate average for each rating category
  const ratingSum = {
    teaching: 0,
    knowledge: 0,
    organization: 0,
    clarity: 0,
    helpfulness: 0
  };
  
  reviews.forEach(review => {
    Object.keys(ratingSum).forEach(criterion => {
      ratingSum[criterion] += review.rating[criterion] || 0;
    });
  });
  
  Object.keys(ratingSum).forEach(criterion => {
    this.ratingDetails[criterion] = ratingSum[criterion] / reviews.length;
  });
  
  // Calculate overall average rating
  const ratingValues = Object.values(this.ratingDetails);
  this.averageRating = ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length;
};

module.exports = mongoose.model('Professor', ProfessorSchema);