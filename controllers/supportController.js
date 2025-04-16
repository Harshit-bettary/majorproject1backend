const SupportInquiry = require('../models/SupportInquiry');

const submitSupportInquiry = async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.user._id;

  try {
    const inquiry = new SupportInquiry({
      user: userId,
      subject,
      message,
    });
    await inquiry.save();
    res.status(201).json({ message: 'Support inquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit support inquiry', error: err.message });
  }
};

module.exports = { submitSupportInquiry };