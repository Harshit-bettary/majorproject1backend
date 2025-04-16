const express = require('express');
const {
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getAllUsers,
  getAllReviews,
  approveReview,
  deleteReview,
  blockUser,
  unblockUser,
  getAllBookings,
  cancelBooking,
  getAllPayments,
  getAllSupportInquiries,
  respondToSupportInquiry,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Vehicle Listings Management
router.get('/vehicles', protect, adminOnly, getAllVehicles);
router.put('/vehicles/:id/approve', protect, adminOnly, approveVehicle);
router.put('/vehicles/:id/reject', protect, adminOnly, rejectVehicle);

// User Accounts Management
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/block', protect, adminOnly, blockUser);
router.put('/users/:id/unblock', protect, adminOnly, unblockUser);

// Bookings Management
router.get('/bookings', protect, adminOnly, getAllBookings);
router.put('/bookings/:id/cancel', protect, adminOnly, cancelBooking);

// Payment Transactions Monitoring
router.get('/payments', protect, adminOnly, getAllPayments);

// Review routes
router.get('/reviews', protect,adminOnly,getAllReviews);
router.put('/reviews/:id/approve', protect,adminOnly,approveReview);
router.delete('/reviews/:id', protect,adminOnly, deleteReview);

// User Support Handling
router.get('/support', protect, adminOnly, getAllSupportInquiries);
router.put('/support/:id/respond', protect, adminOnly, respondToSupportInquiry);

module.exports = router;