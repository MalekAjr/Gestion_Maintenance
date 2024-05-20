const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = "63fe6a74378ef7270e9a2e35";
const mongoose = require('mongoose');

const Event = require('../models/eventModel');

const createToken = (_id) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: '4h' });
};

const signupUser = async (req, res) => {

  let image = null;
  
      if (req.file) {
        image = req.file.filename;
      }

  const { nom, phone, email, password } = req.body;

  if (!nom || !phone || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  try {
    const existingNom = await User.findOne({ nom });
    if (existingNom) {
      return res.status(400).json({ error: 'Le nom est déjà utilisé.' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  
  const phoneRegex = /^\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Le numéro de téléphone doit être composé de 8 chiffres.' });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre, un caractère spécial et être d\'au moins 8 caractères.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ nom, phone, email, password: hashedPassword, image });

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user._id);

    res.status(200).json({ email, token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

////try this now 
const getUser = async (req, res) => {
  try {
    // Récupérez l'ID de l'utilisateur authentifié à partir du jeton d'accès
    const authenticatedUserId = req.user._id;

    // Récupérez uniquement les données de l'utilisateur authentifié
    const user = await User.findById(authenticatedUserId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retournez les données de l'utilisateur
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error.message);
    res.status(500).json({ error: "Server error while getting user" });
  }
};

/*
const getUser = async (req, res) => {
  try {
    // Récupérez l'ID de l'utilisateur authentifié à partir du jeton d'accès
    const authenticatedUserId = req.user._id;

    // Récupérez l'ID de l'utilisateur demandé dans l'URL
    const requestedUserId = req.params.id;

    // Vérifiez si l'ID demandé correspond à l'ID de l'utilisateur authentifié
    if (authenticatedUserId !== requestedUserId) {
      return res.status(403).json({ error: "You are not authorized to view this user's profile" });
    }

    // Récupérez uniquement les données de l'utilisateur authentifié
    const user = await User.findById(authenticatedUserId);

    // Vérifiez si l'utilisateur existe
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retournez les données de l'utilisateur
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error.message);
    res.status(500).json({ error: "Server error while getting user" });
  }
};
*/

/* ca est vrai  à utiliser */ 
/*
const getUser = async (req, res) => {
  const requestingUserId = req.user._id; // ID de l'utilisateur extrait du jeton d'accès
  const requestedUserId = req.params.id; // ID de l'utilisateur demandé
  
  try {
    // Vérifie si l'utilisateur qui fait la demande correspond à l'utilisateur demandé
    if (requestingUserId !== requestedUserId) {
      return res.status(403).json({ error: "Vous n'êtes pas autorisé à accéder à ce profil" });
    }

    // Si les identifiants correspondent, récupère l'utilisateur demandé
    const user = await User.findById(requestedUserId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error.message);
    res.status(500).json({ error: "Erreur du serveur lors de la récupération de l'utilisateur" });
  }
};
 */

  const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error getting users:", error.message);
      res.status(500).json({ error: "Server error while getting users" });
    }
  };
  

  const deleteUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ error: "Server error while deleting user" });
    }
  };
  

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, email, phone, role, password, address, contact } = req.body;
  let image = '';

  if (req.file) {
      image = req.file.filename;
  } else {
    try {
      const user = await User.findById(id);
      if (user) {
        image = user.image;
      }
    } catch (error) {
      console.error('Error getting user image:', error);
    }
  }

  try {
    const updateFields = { nom, email, phone, role,address, contact, image };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.status(200).json({ success: true, msg: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, msg: 'Error updating user' });
  }
};

  
/*
const getTechniciens = async (req, res) => {
  try {
    const { date, time } = req.query; 
    const selectedDateTime = new Date(date + 'T' + time);
    const techniciens = await User.find({ role: 'technicien' });

    const techniciensOccupes = await Event.find({
      technicienName: { $in: techniciens.map(technicien => technicien.userName) },
      $or: [
        { start: { $lte: selectedDateTime }, end: { $gte: selectedDateTime } },
      ],
    }).distinct('technicienName');

    // Filtrez les techniciens pour exclure ceux qui ont des événements pendant ce temps
    const techniciensDisponibles = techniciens.filter(technicien => !techniciensOccupes.includes(technicien.userName));

    res.status(200).json({ techniciens: techniciensDisponibles });
  } catch (error) {
    console.error("Error getting techniciens:", error.message);
    res.status(500).json({ error: "Server error while getting techniciens" });
  }
};

*/

const getTechniciens = async (req, res) => {
  try {
    // Récupérer la date de début et de fin à partir des paramètres de la requête
    const { startDate, endDate } = req.body;

    // Vérifier si les dates de début et de fin sont fournies
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, msg: 'Veuillez fournir une date de début et une date de fin' });
    }

    // Convertir les dates en objets Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Récupérer tous les techniciens
    const techniciens = await User.find({ role: 'technicien' });

    // Créer une liste pour stocker les techniciens sans événements pendant l'intervalle spécifié
    const techniciensSansEvenements = [];

    // Pour chaque technicien, vérifiez s'il a des événements pendant l'intervalle spécifié
    for (const technicien of techniciens) {
      // Récupérer les événements associés à ce technicien qui chevauchent l'intervalle spécifié
      const evenements = await Event.find({
        technicienName: technicien.nom,
        $or: [
          { start: { $lt: end }, end: { $gt: start } }, // L'événement commence ou se termine pendant l'intervalle
          { start: { $gte: start, $lte: end } }, // L'événement commence et se termine pendant l'intervalle
        ],
      });

      // Si le technicien n'a pas d'événements pendant l'intervalle spécifié, ajoutez-le à la liste
      if (evenements.length === 0) {
        techniciensSansEvenements.push(technicien);
      }
    }

    // Envoyer la liste des techniciens sans événements pendant l'intervalle spécifié en réponse
    res.status(200).json({ success: true, msg: 'Techniciens sans événements pendant l\'intervalle spécifié récupérés', data: techniciensSansEvenements });
  } catch (error) {
    console.error('Erreur lors de la récupération des techniciens sans événements pendant l\'intervalle spécifié :', error);
    res.status(500).json({ success: false, msg: 'Erreur serveur lors de la récupération des techniciens sans événements pendant l\'intervalle spécifié' });
  }
};

const getClientDetails = async (req, res) => {
  try {
    const user = await User.findOne({ nom: req.params.clientName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


  module.exports = {
    signupUser,
    loginUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getTechniciens,
    getClientDetails
  };