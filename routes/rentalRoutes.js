const express = require('express');
const { getRentalHistory, getAllRentalHistory } = require('../controllers/rentalHistoryController.js');
const { protect,adminOnly } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/my', protect, getRentalHistory); 
router.get('/all', protect, adminOnly, getAllRentalHistory); // Admins get all

module.exports = router;
