const express = require('express');
const { createCheckoutSession, confirmBookingAfterPayment, getPaymentHistory } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/confirm-booking', protect, confirmBookingAfterPayment);
router.get('/payment-history', protect, getPaymentHistory); 

module.exports = router;