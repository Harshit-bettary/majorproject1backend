const express = require('express');
const { submitSupportInquiry } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitSupportInquiry);

module.exports = router;