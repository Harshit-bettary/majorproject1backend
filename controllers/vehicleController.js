const Vehicle = require('../models/Vehicle.js');
const Review =require('../models/Review.js');

const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({ ...req.body, owner: req.user._id });
    const saved = await vehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'name email');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name email') 
      .populate('reviews');  

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const reviews = vehicle.reviews.filter(review => review.isApproved);
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    res.json({ ...vehicle.toObject(), averageRating: averageRating.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (req.user.role !== "Admin" && vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};