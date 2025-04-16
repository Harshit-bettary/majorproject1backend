const Booking = require('../models/Booking.js');
const Vehicle = require('../models/Vehicle.js');
const User = require('../models/User.js');

const getRentalHistory = async (req, res) => {
  try {
    const history = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rental history' });
  }
};

const getAllRentalHistory = async (req, res) => {
  try {
    const history = await Booking.find()
      .populate('vehicle')
      .populate('user')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all rental history' });
  }
};

module.exports = {
  getRentalHistory,
  getAllRentalHistory,
};