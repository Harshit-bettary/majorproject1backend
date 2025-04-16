const Booking = require('../models/Booking.js');
const Vehicle = require('../models/Vehicle.js');

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    const isBooked = await Booking.findOne({
      vehicle: vehicleId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (isBooked) {
      return res.status(400).json({ message: 'Vehicle already booked for these dates' });
    }

    const booking = new Booking({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('vehicle');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('vehicle');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};


