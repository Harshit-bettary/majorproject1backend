const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController.js');
const {protect,adminOnly} = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/')
  .get(getAllVehicles)
  .post(protect,adminOnly,createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(protect,adminOnly, updateVehicle)
  .delete(protect,adminOnly,deleteVehicle);

module.exports = router;

