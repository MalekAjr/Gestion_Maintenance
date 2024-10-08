const Fiche = require('../models/ficheModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { EMAIL, PASSWORD } = require('../env.js');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

const createFiche = async (req, res) => {
    try {
      let image = null;
  
      if (req.file) {
        image = req.file.filename;
      }
   
      const date = new Date(req.body.date);

      const fiche = new Fiche({
        client: req.body.client,
        address: req.body.address,
        contact: req.body.contact,
        date: date,
        categories: JSON.parse(req.body.categories),
        equipment: req.body.equipment,
        interventionType: req.body.interventionType,
        descriptif: req.body.descriptif,
        image: image,
        reference: req.body.reference,
        quantite: req.body.quantite,
        prixUnitaire: req.body.prixUnitaire,
        NBheures_Mission: req.body.NBheures_Mission,
        NBheures_Trajet: req.body.NBheures_Trajet,
        fraisMission: req.body.fraisMission,
        heurestart:req.body.heurestart,
        heureend:req.body.heureend,
        statuttechnique: 1,
        statutclient: 1,
        statuttechnicien: 1,
        statutservice:1,
        comment:req.body.comment,
        user_id: req.user._id,
        user_email: '',
        user_nom: '',
        hourlyRate: req.body.hourlyRate,
        piecePrice: req.body.piecePrice,
        heuresPrice: req.body.heuresPrice,
        totalPrice: req.body.totalPrice,
        prixTVA: 0,
      });
  
      User.findById(req.user._id)
        .then(user => {
          if (!user) {
            return Promise.reject(new Error('User not found'));
          }
          fiche.user_email = user.email;
          fiche.user_nom = user.nom;
          return fiche.save();
        })
        .then(savedFiche => {
          console.log('Fiche saved successfully:', savedFiche);
          res.status(200).send({ success: true, msg: 'Fiche Data', data: savedFiche });
        })
        .catch(error => {
          console.error('Error saving fiche:', error);
          res.status(400).send({ success: false, msg: error.message });
        });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).send({ success: false, msg: error.message });
    }
};

  



const getFiches = async (req, res) => {
    try {
        const fiches = await Fiche.find().sort({ createdAt: -1 });

        res.status(200).send({ success: true, msg: 'Fiches Data retrieved', data: fiches });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

/*const getFicheUser = async (req, res) => {
    const user_id = req.user ? req.user._id : null;

    try {
        const fiche = await Fiche.find({user_id }).sort({createdAt: -1});
        res.status(200).send({success:true,msg:'fiche Data geted',data:fiche});

    } catch (error) {
        res.status(400).send({ success:false,msg:error.message })
    }
};*/

const getFicheByID = async (req, res) => {
    const ficheId = req.params.id;

    try {
        const fiche = await Fiche.findById(ficheId);
        if (!fiche) {
            return res.status(404).send({ success: false, msg: 'Fiche not found' });
        }

        res.status(200).send({ success: true, msg: 'Fiche Data retrieved', data: fiche });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getFicheUser = async (req, res) => {
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

        if (user.role === "utilisateur") {
            console.log("Fetching fiche for utilisateur:", user.nom);
            const fiche = await Fiche.find({ client: user.nom }).sort({ createdAt: -1 });
            console.log("Fiche for utilisateur:", fiche);
            res.status(200).send({ success: true, msg: 'Fiche Data retrieved', data: fiche });
        } else {
            console.log("Fetching fiche for user_id:", user_id);
            const fiche = await Fiche.find({ user_id }).sort({ createdAt: -1 });
            console.log("Fiche for user_id:", fiche);
            res.status(200).send({ success: true, msg: 'Fiche Data retrieved', data: fiche });
        }
        
    } catch (error) {
        console.error("Error fetching fiche:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
};




const deleteFiche = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the fiche exists before deleting
        const existingFiche = await Fiche.findById(id);
        if (!existingFiche) {
            return res.status(400).send({ success: false, msg: 'Fiche already deleted' });
        }

        // Use Fiche model to delete the document by _id
        await Fiche.findByIdAndDelete(id);

        res.status(200).send({ success: true, msg: 'Fiche deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

/* Fait ca et changer pour qu'il soit
const sendEmailAutomatique = async (userEmail) => {
    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Hpc Group",
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: "Hpc Group",
            intro: "Le technicien va venir pour corriger votre problème.",
            outro: "Cordialement, Hpc Group"
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Intervention Technique",
        html: mail
    };

    try {
        await transporter.sendMail(message);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
*/

const sendEmailAutomatique = async () => {
    // Adresse e-mail du service de facturation ou destinataire approprié
    let serviceBillingEmail = 'd.benali@hpc-group.com.tn';

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Hpc Group",
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: "Hpc Group App",
            intro: "La demande a été accépté, va le cloturer.",
            outro: "Cordialement, Hpc Group"
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: serviceBillingEmail, // Adresse e-mail du service de facturation
        subject: "Nouvelle Facturation(Mail Automatique)",
        html: mail
    };

    try {
        await transporter.sendMail(message);
        console.log("Email sent to service de facturation successfully");
    } catch (error) {
        console.error("Error sending email to service de facturation:", error);
    }
};

const updateFiche = async (req, res) => {
    try {
        const ficheId = req.params.id;
        const {
            client, address, contact, date, categories, equipment, interventionType,
            descriptif, reference, quantite, prixUnitaire, NBheures_Mission,
            NBheures_Trajet, fraisMission, statut, statuttechnique, statutclient,
            statuttechnicien, statutservice, comment, hourlyRate, piecePrice,
            heuresPrice, prixTVA, totalPrice,
        } = req.body;

        // Prepare the updateFields object
        let updateFields = {
            client, address, contact, date, equipment, interventionType, descriptif,
            reference, quantite, prixUnitaire, NBheures_Mission, NBheures_Trajet,
            fraisMission, statut, statuttechnique, statutclient, statuttechnicien,
            statutservice, comment, hourlyRate, piecePrice, heuresPrice, prixTVA ,totalPrice
        };

        // Handle the categories field if it is defined
        if (categories) {
            if (typeof categories === 'string') {
                try {
                    updateFields.categories = JSON.parse(categories);
                } catch (error) {
                    updateFields.categories = categories.split(',').map(category => category.trim());
                }
            } else if (Array.isArray(categories)) {
                updateFields.categories = categories;
            } else {
                throw new TypeError('Invalid type for categories');
            }
        }

        // Include the image file if it is provided
        if (req.file) {
            updateFields.image = req.file.filename;
        }

        console.log("Updating fiche with ID:", ficheId);
        console.log("Update Fields:", updateFields);

        // Update the fiche and return the new version
        const updatedFiche = await Fiche.findByIdAndUpdate(ficheId, updateFields, { new: true });

        if (!updatedFiche) {
            console.log("Fiche not found.");
            return res.status(404).json({ success: false, msg: 'Fiche not found' });
        }

        console.log("Fiche updated successfully:", updatedFiche);

        // Vérifier si tous les statuts sont 2, puis envoyer un email
        if (updatedFiche.statuttechnique === 2 && updatedFiche.statutclient === 2 && updatedFiche.statuttechnicien === 2) {
            console.log("Sending email to Servie Facturation ");
            await sendEmailAutomatique(updatedFiche.contact);
        }

        res.status(200).json({ success: true, msg: 'Fiche updated successfully', data: updatedFiche });
    } catch (error) {
        console.error('Error updating fiche:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};



const getFichesDemandes = async (req, res) => {
    try {
        const fichesDemandes = await Fiche.find({ statutclient: 2 });

        const totalDemandes = await Fiche.countDocuments();

        const demandesAcceptees = fichesDemandes.length;
        const demandesRefuser = await Fiche.countDocuments({ statutclient: 0 });
        const demandesEnCours = await Fiche.countDocuments({ statutclient: 1 });

        const pourcentageAcceptees = (demandesAcceptees / totalDemandes) * 100;
        const pourcentageRefuser = (demandesRefuser / totalDemandes) * 100;
        const pourcentageEnCours = (demandesEnCours / totalDemandes) * 100;

        res.status(200).send({ 
            success: true, 
            msg: 'Fiches Demandes Data retrieved', 
            data: { 
                fichesDemandes: fichesDemandes,
                totalDemandes: totalDemandes,
                demandesAcceptees: demandesAcceptees,
                demandesRefuser: demandesRefuser,
                demandesEnCours: demandesEnCours,
                pourcentageAcceptees: pourcentageAcceptees,
                pourcentageRefuser: pourcentageRefuser,
                pourcentageEnCours: pourcentageEnCours
            } 
        });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

/*
const getFichesDemandesParClient = async (req, res) => {
    try {
        const clientId = req.params.clientId;

        if (!clientId) {
            return res.status(400).send({ success: false, msg: 'Client ID is required' });
        }

        // Obtenez les fiches du client spécifique
        const totalDemandes = await Fiche.countDocuments({ client: clientId });

        // Agrégez les fiches par statutclient pour obtenir les demandes acceptées et refusées
        const demandesParClient = await Fiche.aggregate([
            { $match: { client: clientId } },
            {
                $group: {
                    _id: "$client",
                    totalDemandes: { $sum: 1 },
                    demandesAcceptees: {
                        $sum: { $cond: [{ $eq: ["$statutclient", 2] }, 1, 0] }
                    },
                    demandesRefuser: {
                        $sum: { $cond: [{ $eq: ["$statutclient", 0] }, 1, 0] }
                    }
                }
            }
        ]);

        // Vérifiez si des fiches existent pour le client
        if (demandesParClient.length === 0) {
            return res.status(404).send({ success: false, msg: 'No data found for the specified client' });
        }

        // Ajoutez les pourcentages acceptées et refusées pour le client
        const clientData = demandesParClient[0];
        const pourcentageAcceptees = (clientData.demandesAcceptees / clientData.totalDemandes) * 100;
        const pourcentageRefuser = (clientData.demandesRefuser / clientData.totalDemandes) * 100;

        const response = {
            client: clientData._id,
            totalDemandes: clientData.totalDemandes,
            demandesAcceptees: clientData.demandesAcceptees,
            demandesRefuser: clientData.demandesRefuser,
            pourcentageAcceptees: pourcentageAcceptees,
            pourcentageRefuser: pourcentageRefuser
        };

        res.status(200).send({ 
            success: true, 
            msg: 'Fiches Demandes Data retrieved', 
            data: response
        });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};
*/



module.exports = {
    createFiche,
    getFiches,
    getFicheByID,
    getFicheUser,
    deleteFiche,
    updateFiche,
    getFichesDemandes,
    // getFichesDemandesParClient
};