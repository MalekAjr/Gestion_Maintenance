const express = require('express');
const eventrouter = express.Router();
const eventcontroller = require('../controllers/eventController');
const authenticateToken = require('../middleware/requireAuth');

eventrouter.post('/create-event', authenticateToken, eventcontroller.createEvent);
eventrouter.get('/get-events', authenticateToken, eventcontroller.getEvents);

eventrouter.get('/delete-event/:id', authenticateToken, eventcontroller.deleteEvent);
eventrouter.put('/update-event/:id', authenticateToken,  eventcontroller.updateEvent);
eventrouter.get('/getPlanningOneTechnicien', authenticateToken,  eventcontroller.getPlanningOneTechnicien);

module.exports = eventrouter;
