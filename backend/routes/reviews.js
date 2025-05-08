const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  reportReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// Import auth middleware
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/report')
  .post(protect, reportReview);

module.exports = router;