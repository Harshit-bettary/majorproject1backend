const express = require('express');
const { addReview } = require('../controllers/reviewController.js');
const Review = require('../models/Review.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

const restrictToUser = (req, res, next) => {
  if (req.user.role.toLowerCase() !== 'user') {
    return res.status(403).json({ message: 'Access denied: Only users can perform this action' });
  }
  next();
};

router.get('/my', protect, restrictToUser, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('vehicle', 'make model')
      .lean(); 
    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]); 
    }
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ message: 'Failed to fetch user reviews', error: err.message });
  }
});

// Public: View approved reviews for a specific vehicle
router.get('/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const reviews = await Review.find({ vehicle: vehicleId, approved: true })
      .populate('user', 'name') 
      .lean();
    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]); 
    }
  } catch (err) {
    console.error('Error fetching vehicle reviews:', err);
    res.status(500).json({ message: 'Failed to fetch vehicle reviews', error: err.message });
  }
});

// Protected: Add a review (only for users with completed bookings)
router.post('/:vehicleId', protect, restrictToUser, addReview);

module.exports = router;