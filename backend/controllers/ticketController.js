const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Notification = require('../models/NotificationModel');

const createTicket = async (req, res) => {
    const { title, description, priority, category } = req.body;
    
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            throw new Error('User not found');
        }

        const newTicket = new Ticket({
            title,
            description,
            priority,
            category,
            statutticket: 0,
            user_id: req.user._id,
            user_email: user.email,
            user_nom: user.nom,
        });

        const savedTicket = await newTicket.save();
        console.log('Ticket saved successfully:', savedTicket);

        const notificationMessage = `${user.nom} a créé un nouveau ticket de titre "${title}"`;
        console.log(notificationMessage);
        // Créer une nouvelle instance de Notification avec le message de notification
        const newNotification = new Notification({
            message: notificationMessage
        });

        // Enregistrer la notification dans la base de données
        await newNotification.save();

        // Récupérer le dernier message de notification
       //  const lastNotificationMessage = await getLastNotificationMessage();

        // Émettre un événement de notification avec Socket.IO
        req.app.get('io').emit('notification', newNotification);

        res.status(200).send({ success: true, msg: 'Fiche Data', data: savedTicket });
    } catch (error) {
        console.error('Error saving Ticket Data:', error);
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });

        res.status(200).send({ success: true, msg: 'Tickets Data retrieved', data: tickets });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getTicketsUser = async (req, res) => {
    const user_id = req.user ? req.user._id : null;
    
    try {
        if (!user_id) {
            return res.status(400).send({ success: false, msg: "User ID not provided" });
        }

        const tickets = await Ticket.find({ user_id }).sort({ createdAt: -1 });
        console.log("Tickets for user_id:", tickets);
        res.status(200).send({ success: true, msg: 'Ticket Data retrieved', data: tickets });
        
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).send({ success: false, msg: error.message });
    }
};

const getOneTicket = async (req, res) => {
    try {
        const id = req.params.id;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).send({ success: false, msg: 'Ticket not found' });
        }

        res.status(200).send({ success: true, msg: 'Ticket found', data: ticket });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const deleteTicket = async (req, res) => {
    try {
        const id = req.params.id;

        const existingTicket = await Ticket.findById(id);
        if (!existingTicket) {
            return res.status(400).send({ success: false, msg: 'Ticket already deleted' });
        }

        await Ticket.findByIdAndDelete(id);

        res.status(200).send({ success: true, msg: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const updateTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { title, description, priority, category, statutticket } = req.body;

        let updateFields = { title, description, priority, category, statutticket };

        console.log("Updating ticket with ID:", ticketId);
        console.log("Update Fields:", updateFields);

        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateFields, { new: true });

        if (!updatedTicket) {
            console.log("Ticket not found.");
            return res.status(404).json({ success: false, msg: 'Ticket not found' });
        }

        console.log("Ticket updated successfully:", updatedTicket);
        res.status(200).json({ success: true, msg: 'Ticket updated successfully', data: updatedTicket });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(400).json({ success: false, msg: error.message });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getOneTicket,
    getTicketsUser,
    deleteTicket,
    updateTicket
};
