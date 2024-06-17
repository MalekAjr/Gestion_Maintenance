const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
