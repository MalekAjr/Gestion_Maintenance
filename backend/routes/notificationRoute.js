const express = require('express');
const notificationrouter = express.Router();
const { addNotification, getLastNotificationMessage, getAllNotifications ,markNotificationsAsRead,getUnreadNotifications } = require('../controllers/notificationController');

notificationrouter.post('/add-notification', addNotification);
notificationrouter.get('/last-notification-message', getLastNotificationMessage);
notificationrouter.get('/get-all-notifications', getAllNotifications);
notificationrouter.post('/mark-notifications-as-read', markNotificationsAsRead);
notificationrouter.get('/unread-notifications', getUnreadNotifications);


module.exports = notificationrouter;
