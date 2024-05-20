const mongoose = require('mongoose');

const pieceSchema = mongoose.Schema({
    reference:{
        type:String,
        required:true,
        unique: true
    },
    quantite:{
        type:Number,
        required:true
    },
    descriptif:{
        type:String,
        required:true
    },
    lieudestockage:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    fournisseur:{
        type:String,
        required:true
    }
   /* fournisseur_id: {
        type: String,
        required: true
      },
      fournisseur_nom: {
        type: String,
        required: true
      },*/
    
},  { timestamps: true })

module.exports = mongoose.model("Piece",pieceSchema, "Piece");