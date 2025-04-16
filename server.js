const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/db.js');

// Route imports
const authRoutes = require('./routes/authRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const rentalRoutes = require('./routes/rentalRoutes.js'); 
const profileRoutes =require('./routes/profileRoutes.js');
const adminRoutes = require('./routes/adminRoutes'); 
const supportRoutes = require('./routes/supportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth/profile',profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes); 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

