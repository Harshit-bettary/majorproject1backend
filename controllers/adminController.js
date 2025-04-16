const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Booking = require('../models/Booking');
const SupportInquiry = require('../models/SupportInquiry');
const Review = require('../models/Review'); // Add Review model

// Vehicle Listings Management
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: err.message });
  }
};

const approveVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    if (vehicle.isApproved) {
      return res.status(400).json({ message: 'Vehicle is already approved' });
    }
    vehicle.isApproved = true;
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle approved successfully', vehicle });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve vehicle', error: err.message });
  }
};

const rejectVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    if (!vehicle.isApproved) {
      return res.status(400).json({ message: 'Vehicle is already rejected' });
    }
    vehicle.isApproved = false;
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle rejected successfully', vehicle });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject vehicle', error: err.message });
  }
};

// User Accounts Management
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.isBlocked) {
      return res.status(400).json({ message: 'User is already blocked' });
    }
    user.isBlocked = true;
    await user.save();
    res.status(200).json({ message: 'User blocked successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user', error: err.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isBlocked) {
      return res.status(400).json({ message: 'User is already unblocked' });
    }
    user.isBlocked = false;
    await user.save();
    res.status(200).json({ message: 'User unblocked successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unblock user', error: err.message });
  }
};

// Bookings Management
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('vehicle', 'make model');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    booking.status = 'Cancelled';
    await booking.save();
    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
};

// Payment Transactions Monitoring
const getAllPayments = async (req, res) => {
  try {
    const bookings = await Booking.find({ paymentStatus: 'Completed' })
      .populate('user', 'name email')
      .populate('vehicle', 'make model');
    const payments = bookings.map((booking) => ({
      bookingId: booking._id,
      user: booking.user,
      vehicle: booking.vehicle,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    }));
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
  }
};

// User Support Handling
const getAllSupportInquiries = async (req, res) => {
  try {
    const inquiries = await SupportInquiry.find().populate('user', 'name email');
    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch support inquiries', error: err.message });
  }
};

const respondToSupportInquiry = async (req, res) => {
  const { response } = req.body;
  try {
    const inquiry = await SupportInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Support inquiry not found' });
    }
    if (inquiry.status === 'Resolved') {
      return res.status(400).json({ message: 'Inquiry is already resolved' });
    }
    inquiry.response = response;
    inquiry.status = 'Resolved';
    inquiry.updatedAt = Date.now();
    await inquiry.save();
    res.status(200).json({ message: 'Response sent successfully', inquiry });
  } catch (err) {
    res.status(500).json({ message: 'Failed to respond to inquiry', error: err.message });
  }
};

// Reviews Management
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('vehicle', 'make model');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.isApproved) {
      return res.status(400).json({ message: 'Review is already approved' });
    }
    review.isApproved = true;
    await review.save();
    res.status(200).json({ message: 'Review approved successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve review', error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

module.exports = {
  getAllVehicles,
  approveVehicle,
  rejectVehicle,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllBookings,
  cancelBooking,
  getAllPayments,
  getAllSupportInquiries,
  respondToSupportInquiry,
  getAllReviews,
  approveReview,
  deleteReview,
};