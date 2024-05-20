const Piece = require('../models/pieceModel');
// const User = require('../models/userModel');
const mongoose = require('mongoose');

const createPiece = async (req, res) => {
    try {
        let image = null; // Default to null if no file is uploaded

        // Check if req.file exists and get the file path
        if (req.file) {
            image = req.file.filename;
        }

        const piece = new Piece({
            reference: req.body.reference,
            quantite: req.body.quantite,
            descriptif: req.body.descriptif,
            lieudestockage: req.body.lieudestockage,
            image: image, // Use the image filename if available, otherwise null
            fournisseur: req.body.fournisseur
        });

        const pieceData = await piece.save();

        console.log('Saved Piece Data:', pieceData);

        res.status(200).send({ success: true, msg: 'Piece Data', data: pieceData });

    } catch (error) {
        console.error('try another reference is unique, Error:', error);
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getPieces = async (req, res) => {
    try {
        // Fetch all pieces from the database
        const pieces = await Piece.find().sort({ createdAt: -1 });

        res.status(200).send({ success: true, msg: 'Pieces Data retrieved', data: pieces });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const deletePiece = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the piece exists before deleting
        const existingPiece = await Piece.findById(id);
        if (!existingPiece) {
            return res.status(400).send({ success: false, msg: 'Piece already deleted' });
        }

        // Use Piece model to delete the document by _id
        await Piece.findByIdAndDelete(id);

        res.status(200).send({ success: true, msg: 'Piece deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};



const updatePiece = async (req, res) => {
    try {
        const pieceId = req.params.id;
        const { reference, quantite, descriptif, lieudestockage, fournisseur } = req.body; // Include all fields

        let updateFields = { reference, quantite, descriptif, lieudestockage, fournisseur };
        if (req.file) {
            updateFields.image = req.file.filename;
        }

        console.log("Updating piece with ID:", pieceId);
        console.log("Update Fields:", updateFields);

        const updatedPiece = await Piece.findByIdAndUpdate(pieceId, updateFields, { new: true });

        if (!updatedPiece) {
            console.log("Piece not found.");
            return res.status(404).json({ success: false, msg: 'Piece not found' });
        }

        console.log("Piece updated successfully:", updatedPiece);
        res.status(200).json({ success: true, msg: 'Piece updated successfully', data: updatedPiece });
    } catch (error) {
        console.error('Error updating piece:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};


module.exports = {
    createPiece,
    getPieces,
    deletePiece,
    updatePiece
};