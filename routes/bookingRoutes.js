const express = require('express');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController.js');
const {
  protect,
  adminOnly
} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;