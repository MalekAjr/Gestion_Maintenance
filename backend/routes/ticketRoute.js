const express = require('express');
const ticketRouter = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/requireAuth');

ticketRouter.post('/create-ticket', authenticateToken, ticketController.createTicket);
ticketRouter.get('/get-tickets', authenticateToken, ticketController.getTickets);
ticketRouter.get('/get-ticket/:id', authenticateToken, ticketController.getOneTicket);
ticketRouter.delete('/delete-ticket/:id', authenticateToken, ticketController.deleteTicket);
ticketRouter.put('/update-ticket/:id', authenticateToken, ticketController.updateTicket);
ticketRouter.get('/get-ticketuser', authenticateToken, ticketController.getTicketsUser);


module.exports = ticketRouter;
