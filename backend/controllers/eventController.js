const Event = require('../models/eventModel');
const User = require('../models/userModel');


const createEvent = async (req, res) => {
  try {
    const { title, description, start, end, statut, userId, userName, technicienName = '', carName } = req.body;
    
    const existingEvent = await Event.findOne({
      $or: [
        { start: { $lte: end }, end: { $gte: start } },
        { start: { $gte: start, $lte: end } },
      ],
      technicienName: technicienName,
    });

    if (existingEvent) {
      return res.status(400).json({ error: 'Le technicien est déjà assigné à un événement pendant cette période' });
    }

    const techniciens = await User.find({ role: 'technicien' });

    const overlappingEvents = await Event.find({
      $or: [
        { start: { $lte: end }, end: { $gte: start } },
        { start: { $gte: start, $lte: end } },
      ],
    });

    const newEvent = new Event({
      title,
      description,
      start,
      end,
      statut:0,
      statuttechnicien: 0,
      userId,
      userName,
      technicienName,
      carName
    });

    // Enregistrer l'événement dans la base de données
    const eventData = await newEvent.save();

    console.log('Saved Event Data:', eventData);

    res.status(200).send({ success: true, msg: 'Event Data saved successfully', data: eventData });

  } catch (error) {
    console.error('Error saving Event Data:', error);
    res.status(400).send({ success: false, msg: error.message });
  }
};

  
  const getEvents = async (req, res) => {
    try {
      // Fetch all events from the database
      const events = await Event.find().sort({ createdAt: -1 });
  
      res.status(200).send({ success: true, msg: 'Events Data retrieved', data: events });
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };
  
  const getPlanningOneTechnicien = async (req, res) => {
    const user_id = req.user ? req.user._id : null;

    try {
      // Récupérer le nom du technicien connecté
      // const technicienName = req.user.nom;
      const user = await User.findById(user_id);
      // Recherche des événements où le technicien connecté est inclus
      const events = await Event.find({ technicienName: user.nom });

      res.status(200).json({ success: true, msg: 'Technician\'s events retrieved successfully', data: events });
    } catch (error) {
      console.error('Error retrieving technician\'s events:', error);
      res.status(400).json({ success: false, msg: error.message });
    }
  };

  const deleteEvent = async (req, res) => {
    try {
      const id = req.params.id;
  
      // Check if the fiche exists before deleting
      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        return res.status(400).send({ success: false, msg: 'Event already deleted' });
      }
  
      // Use Fiche model to delete the document by _id
      await Event.findByIdAndDelete(id);
  
      res.status(200).send({ success: true, msg: 'Event deleted successfully' });
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };
  
  const updateEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
      const { title, description, start, end, statut,statuttechnicien, userId, userName, technicienName, carName } = req.body;
  
      // Vérifiez si le technicien est déjà assigné à un événement pendant cette période
      const existingEvent = await Event.findOne({
        $and: [
          { _id: { $ne: eventId } }, // Ne pas inclure l'événement en cours de mise à jour
          { $or: [
              { start: { $lte: end }, end: { $gte: start } },
              { start: { $gte: start, $lte: end } },
            ]
          },
          { technicienName: technicienName }
        ]
      });
  
      if (existingEvent) {
        return res.status(400).json({ error: 'Le technicien est déjà assigné à un événement pendant cette période' });
      }
  
      let updateFields = { title, description, start, end, statut, statuttechnicien, userId, userName, technicienName, carName };
  
      console.log("Updating event with ID:", eventId);
      console.log("Update Events:", updateFields);
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, updateFields, { new: true });
  
      if (!updatedEvent) {
        console.log("Event not found.");
        return res.status(404).json({ success: false, msg: 'Event not found' });
      }
  
      console.log("Event updated successfully:", updatedEvent);
      res.status(200).json({ success: true, msg: 'Event updated successfully', data: updatedEvent });
  
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(400).json({ success: false, msg: error.message });
    }
  };
  
  // Nouvelle fonction pour récupérer les événements chevauchant une période donnée
  const getOverlappingEvents = async (req, res) => {
    try {
      const { start, end } = req.query;
  
      // Convertir les dates de chaînes en objets Date
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      // Récupérer les événements qui chevauchent la période donnée
      const overlappingEvents = await Event.find({
        $or: [
          { start: { $lte: endDate }, end: { $gte: startDate } },
          { start: { $gte: startDate, $lte: endDate } },
        ],
      });
  
      res.status(200).json({ success: true, msg: 'Overlapping Events retrieved successfully', data: overlappingEvents });
  
    } catch (error) {
      console.error('Error retrieving overlapping events:', error);
      res.status(400).json({ success: false, msg: error.message });
    }
  };
  
  module.exports = {
    createEvent,
    getEvents,
    deleteEvent,
    updateEvent,
    getOverlappingEvents,
    getPlanningOneTechnicien,
  };