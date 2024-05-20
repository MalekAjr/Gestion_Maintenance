const OrdreDeMission = require('../models/ordremissionModel');
const mongoose = require('mongoose');
const User = require('../models/userModel');

const createOrdreMission = async (req, res) => {
    try {
        const { startHour, endHour, destination, transportType, heuresRealisees, kilometrageEffectue } = req.body;

        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        const newOrdreMission = new OrdreDeMission({
            startDate,
            endDate,
            startHour,
            endHour,
            destination,
            transportType,
            heuresRealisees,
            kilometrageEffectue,
            statuttechnicien: 1,
            statutadmin: 1,
        user_id: req.user._id,
        user_email: '',
        user_nom: '',
        });

        User.findById(req.user._id)
        .then(user => {
          if (!user) {
            return Promise.reject(new Error('User not found'));
          }
          newOrdreMission.user_email = user.email;
          newOrdreMission.user_nom = user.nom;
          return newOrdreMission.save();
        })
        .then(savedordremission => {
          console.log('Ordre saved successfully:', savedordremission);
          res.status(200).send({ success: true, msg: 'Ordre de mission enregistré avec succès', data: savedordremission });
        })
        .catch(error => {
          console.error('Error saving Ordre Mission:', error);
          res.status(400).send({ success: false, msg: error.message });
        });

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'ordre de mission:', error);
        res.status(400).send({ success: false, msg: error.message });
    }
};



const getOrdresMissions = async (req, res) => {
    try {
        const ordresMissions = await OrdreDeMission.find().sort({ createdAt: -1 });

        res.status(200).send({ success: true, msg: 'Ordres de mission récupérés', data: ordresMissions });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getOrdreMissionByID = async (req, res) => {
    try {
        const ordreMissionId = req.params.id;

        const ordreMission = await OrdreDeMission.findById(ordreMissionId);

        if (!ordreMission) {
            return res.status(404).json({ success: false, msg: 'Ordre de mission non trouvé' });
        }

        res.status(200).json({ success: true, msg: 'Ordre de mission récupéré avec succès', data: ordreMission });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ordre de mission par ID:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};

const getOrdreMissionsOneUser = async (req, res) => {
    const user_id = req.user ? req.user._id : null;
    
    try {
        if (!user_id) {
            return res.status(400).send({ success: false, msg: "User ID not provided" });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).send({ success: false, msg: "User not found" });
        }
        
        console.log("User ID:", user_id);
        console.log("User Role:", user.role);
        console.log("User Nom:", user.nom);

            console.log("Fetching ordre de Mission for user_id:", user_id);
            const ordremission = await OrdreDeMission.find({ user_id }).sort({ createdAt: -1 });
            console.log("Ordre de Mission for user_id:", ordremission);
            res.status(200).send({ success: true, msg: 'Ordre Data retrieved', data: ordremission });
        
        
    } catch (error) {
        console.error("Error fetching Ordre:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
};

const deleteOrdreMission = async (req, res) => {
    try {
        const id = req.params.id;

        const existingOrdreMission = await OrdreDeMission.findById(id);
        if (!existingOrdreMission) {
            return res.status(400).send({ success: false, msg: 'Ordre de mission déjà supprimé' });
        }

        await OrdreDeMission.findByIdAndDelete(id);

        res.status(200).send({ success: true, msg: 'Ordre de mission supprimé avec succès' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const updateOrdreMission = async (req, res) => {
    try {
        const ordreMissionId = req.params.id;
        const { startDate, endDate, startHour, endHour, destination, transportType, heuresRealisees, kilometrageEffectue, statuttechnicien, statutadmin } = req.body;

        let updateFields = { startDate, endDate, startHour, endHour, destination, transportType, heuresRealisees, kilometrageEffectue, statuttechnicien, statutadmin };

        console.log("Mise à jour de l'ordre de mission avec l'ID:", ordreMissionId);
        console.log("Champs mis à jour:", updateFields);

        const updatedOrdreMission = await OrdreDeMission.findByIdAndUpdate(ordreMissionId, updateFields, { new: true });

        if (!updatedOrdreMission) {
            console.log("Ordre de mission non trouvé.");
            return res.status(404).json({ success: false, msg: 'Ordre de mission non trouvé' });
        }

        console.log("Ordre de mission mis à jour avec succès:", updatedOrdreMission);
        res.status(200).json({ success: true, msg: 'Ordre de mission mis à jour avec succès', data: updatedOrdreMission });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'ordre de mission:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};

module.exports = {
    createOrdreMission,
    getOrdresMissions,
    getOrdreMissionByID,
    getOrdreMissionsOneUser,
    deleteOrdreMission,
    updateOrdreMission
};
