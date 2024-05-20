const express = require('express');
const carrouter = express.Router();
const carController = require('../controllers/carController');
const authenticateToken = require('../middleware/requireAuth');

carrouter.post('/create-car', authenticateToken, carController.createCar);
carrouter.get('/get-cars', authenticateToken, carController.getCars);
carrouter.post('/get-carssansevenements', authenticateToken, carController.getCarsWithoutEvents);
carrouter.delete('/delete-car/:id', authenticateToken, carController.deleteCar);
carrouter.put('/update-car/:id', authenticateToken, carController.updateCar);

module.exports = carrouter;
