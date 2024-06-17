const Notification = require('../models/NotificationModel');

const addNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        const lastNotificationMessage = await getLastNotificationMessage();

        req.app.get('io').emit('notification', notification);

        res.status(201).send(notification);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getLastNotificationMessage = async () => {
  try {
      const lastNotification = await Notification.findOne().sort({ date: -1 });

      if (lastNotification) {
          return lastNotification.message;
      } else {
          return "Aucune notification trouvée";
      }
  } catch (error) {
      console.error('Erreur lors de la récupération du dernier message de notification :', error);
      return "Erreur lors de la récupération du message";
  }
};


const getAllNotifications = async (req, res) => {
  try {
      // Récupérer toutes les notifications de la base de données
      const notifications = await Notification.find().sort({ date: -1 });;

      // Envoyer les notifications récupérées en tant que réponse
      res.status(200).json(notifications);
  } catch (error) {
      // Gérer les erreurs en renvoyant une réponse avec le statut 500 (Internal Server Error)
      res.status(500).json({ error: error.message });
  }
};

const markNotificationsAsRead = async (req, res) => {
  try {
      await Notification.updateMany({ read: false }, { read: true });
      res.status(200).send({ message: 'Notifications marked as read' });
  } catch (error) {
      res.status(500).send(error);
  }
};

const getUnreadNotifications = async (req, res) => {
  try {
      const notifications = await Notification.find({ read: false });
      res.status(200).send(notifications);
  } catch (error) {
      res.status(500).send(error);
  }
};

module.exports = { addNotification, getLastNotificationMessage,
   getAllNotifications, markNotificationsAsRead, getUnreadNotifications };
