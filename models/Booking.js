const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
});


module.exports = mongoose.model("Booking", bookingSchema);

// {
//   "vehicle": "67fd4d1cf8fd360aa5374e52",
//   "user": "67fe06ce91edc8a26e36c2b2",
//   "startDate": "2025-04-20T10:00:00.000Z",
//   "endDate": "2025-04-25T10:00:00.000Z",
//   "totalPrice": 100,
//   "paymentStatus": "Pending",
//   "status": "Pending",
//   "_id": "67fe3a5289e736dad0569fe2",
//   "__v": 0
// }

// admin:admin@gmail.com pass:admin123 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmQ0NGIyYjVkMWY4YTY3NjY5YzU5ZCIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTc0NDcyMDkzNCwiZXhwIjoxNzQ3MzEyOTM0fQ.qqAspYf3A64Gm6upQmjjLy8Z-0lI2A-Kg1_kmSJdTV0
// user1234 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmUwNmNlOTFlZGM4YTI2ZTM2YzJiMiIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzQ0NzcwNjQ1LCJleHAiOjE3NDczNjI2NDV9.nVVar90UqqnYKj3ArOqojno4aOpuUL_pu8DjvSleBlA
//recovey code Z7GEY5Z675DXEYWCRK758585