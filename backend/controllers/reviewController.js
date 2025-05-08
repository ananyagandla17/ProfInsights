const Review = require('../models/Review');
const Professor = require('../models/Professor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');

// @desc    Add review
// @route   POST /api/reviews OR /api/professors/:professorId/reviews
// @access  Public (temporarily)
const addReview = asyncHandler(async (req, res, next) => {
  const professorId = req.params.professorId || null;
  req.body.professorId = professorId;
  const studentId = req.student?.id || null;
  req.body.student = studentId;

  if (req.ip && process.env.IP_HASH_SECRET) {
    req.body.ipHash = crypto
      .createHash('sha256')
      .update(req.ip + process.env.IP_HASH_SECRET)
      .digest('hex');
  }

  if (professorId) {
    const professor = await Professor.findById(professorId);
    if (!professor) {
      return next(new ErrorResponse(`Professor not found with id ${professorId}`, 404));
    }
  }

  const review = await Review.create(req.body);

  if (professorId) {
    const professor = await Professor.findById(professorId);
    if (professor) {
      await professor.updateRatings(req.app.locals.db);
      await professor.save();
    }
  }

  res.status(201).json({
    success: true,
    data: review
  });
});

// Placeholder functions to avoid crash
const getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({ success: true, data: reviews });
});

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).json({ success: true, data: review });
});

const updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });
  res.status(200).json({ success: true, data: review });
});

const deleteReview = asyncHandler(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});

const reportReview = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Review reported (placeholder)' });
});

// Export all
module.exports = {
  addReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  reportReview
};
