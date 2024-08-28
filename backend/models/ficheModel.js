const mongoose = require('mongoose');

const ficheSchema = mongoose.Schema({
    client: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    categories: [{
        type: String,
        enum: ['Injection', 'Périférique', 'Robotique', 'Froid', 'Moules']
    }],
    equipment: {
        type: String,
        required: true
    },
    interventionType: {
        type: String,
        enum: ['Corrective', 'Préventive']
    },
    descriptif: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    reference: {
        type: String,
        required: true
    },
    quantite: {
        type: Number,
        required: true
    },
    prixUnitaire: {
        type: Number,
        required: true
    },
    NBheures_Mission: {
        type: Number,
        required: true
    },
    NBheures_Trajet: {
        type: Number,
        required: true
    },
    fraisMission: {
        type: Number,
        required: true
    },
    heurestart: {
        type: Date,
        required: true,
      },
    heureend: {
        type: Date,
        required: true,
      },
    comment: {
        type: String,
        required: false
    },
    statuttechnique: {
        type: Number,
        required:false
    },
    statutclient: {
        type: Number,
        required:false
    },
    statuttechnicien: {
        type: Number,
        required:false
    },
    statutservice: {
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
    hourlyRate: {
        type: Number,
        required: false
    },
    piecePrice: {
        type: Number,
        required: false
    },
    heuresPrice: {
        type: Number,
        required: false
    },
    totalPrice: {
        type: Number,
        required: false
    },
    prixTVA: { type: Number, required: false }

}, { timestamps: true });

module.exports = mongoose.model("Fiche", ficheSchema, "Fiche d'intervention");
