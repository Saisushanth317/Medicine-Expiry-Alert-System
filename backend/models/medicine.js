const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: String,
  batch: String,
  expiryDate: Date,
  quantity: Number
});

module.exports = mongoose.model('Medicine', medicineSchema);
