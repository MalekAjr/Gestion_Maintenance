const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  statut: {
    type: Number,
    required:false
  },
  statuttechnicien: {
    type: Number,
    required:false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à un modèle d'utilisateur
    required: false, // Peut être facultatif
  },
  userName: {
    type: String,
    default: '',
  },
  technicienName: {
    type: String,
    default: '',
  },
  carName: {
    type: String,
    default: '',
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
