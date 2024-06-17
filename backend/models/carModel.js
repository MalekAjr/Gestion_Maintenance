const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  matricule: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
