const mongoose = require('mongoose');

const ordreDeMissionSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  startHour: {
    type: String,
    required: true,
  },
  endHour: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  transportType: {
    type: String,
    enum: ['Véhicule de l\'entreprise', 'Son Véhicule personnel'],
    required: true,
  },
  heuresRealisees: {
    type: Number,
    required: true,
  },
  kilometrageEffectue: {
    type: Number,
    required: true,
  },
  statuttechnicien: {
    type: Number,
    required:false
},
statutadmin: {
    type: Number,
    required:false
},
user_id: {
  type: String,
  required: true
},
user_email: {
  type: String,
  required: false
},
user_nom: {
  type: String,
  required: false
},

}, { timestamps: true });

const OrdreDeMission = mongoose.model('OrdreDeMission', ordreDeMissionSchema);

module.exports = OrdreDeMission;
