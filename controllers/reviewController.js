const Review = require('../models/Review');
const Booking = require('../models/Booking');

const addReview = async (req, res) => {
  const { vehicleId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const completedBooking = await Booking.findOne({
      user: userId,
      vehicle: vehicleId,
      status: 'Confirmed',
    });

    if (!completedBooking) {
      return res.status(400).json({ message: 'You can only review vehicles you have rented.' });
    }


    const existingReview = await Review.findOne({ user: userId, vehicle: vehicleId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this vehicle.' });
    }

  
    const review = new Review({
      user: userId,
      vehicle: vehicleId,
      rating,
      comment,
      isApproved: false, 
    });

    const savedReview = await review.save();
    res.status(201).json({ message: 'Review submitted for approval.', review: savedReview });
  } catch (err) {
    res.status(500).json({ message: 'Unable to add review', error: err.message });
  }
};

const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vehicle: req.params.vehicleId, isApproved: true })
      .populate('user', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch reviews', error: err.message });
  }
};



module.exports = {
  addReview,
  getVehicleReviews,
};