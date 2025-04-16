const Stripe = require('stripe');
const Booking = require('../models/Booking.js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { vehicle, fromDate, toDate, totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${vehicle.make} ${vehicle.model}`,
              description: `Rental from ${fromDate} to ${toDate}`,
            },
            unit_amount: totalAmount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Internal server error while creating checkout session' });
  }
};

const confirmBookingAfterPayment = async (req, res) => {
  const { sessionId, vehicleId, fromDate, toDate, totalAmount } = req.body;
  const userId = req.user._id;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const existingBooking = await Booking.findOne({
        user: userId,
        vehicle: vehicleId,
        startDate: fromDate,
        endDate: toDate,
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'Booking already exists for these dates' });
      }

      const newBooking = new Booking({
        user: userId,
        vehicle: vehicleId,
        startDate: fromDate,
        endDate: toDate,
        totalPrice: totalAmount,
        paymentStatus: 'Completed',
        status: 'Confirmed',
      });

      await newBooking.save();
      res.status(201).json({
        message: 'Booking confirmed and payment successful',
        booking: newBooking,
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Error confirming booking after payment:', err);
    res.status(500).json({ message: 'Internal server error while confirming booking' });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId }).populate('vehicle');

    res.status(200).json({
      message: 'Payment history fetched successfully',
      bookings: bookings.map((booking) => ({
        vehicle: booking.vehicle,
        totalPrice: booking.totalPrice, 
        paymentStatus: booking.paymentStatus,
        method:'Card',
        bookingDate: booking.startDate, 
        status: booking.status, 
      })),
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error while fetching payment history' });
  }
};

module.exports = {
  createCheckoutSession,
  confirmBookingAfterPayment,
  getPaymentHistory,
};
