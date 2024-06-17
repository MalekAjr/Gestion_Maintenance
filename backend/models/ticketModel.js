const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Basse', 'Moyenne', 'Haute'],
    required: true
  },
  category: {
    type: String,
    enum: ['Technique', 'Facturation', 'Autre'],
    required: true
  },
  statutticket: {
    type: Number,
    required: false
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

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
