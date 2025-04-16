
const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController.js'); // Use existing controller
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile); 

module.exports = router;