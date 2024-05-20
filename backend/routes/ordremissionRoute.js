const express = require('express');
const ordremissionRoute = express.Router();

const bodyParser = require('body-parser');
ordremissionRoute.use(bodyParser.json());
ordremissionRoute.use(bodyParser.urlencoded({extended:true}));

const ordremissionController = require('../controllers/ordremissionController');
const authenticateToken = require('../middleware/requireAuth');


ordremissionRoute.post('/create-ordremission', authenticateToken, ordremissionController.createOrdreMission);
ordremissionRoute.get('/get-ordresmissions', authenticateToken, ordremissionController.getOrdresMissions);
ordremissionRoute.get('/get-ordremissionuser/:id', authenticateToken, ordremissionController.getOrdreMissionByID);
ordremissionRoute.get('/get-ordremissiononeuser', authenticateToken, ordremissionController.getOrdreMissionsOneUser);
ordremissionRoute.delete('/delete-ordremission/:id', authenticateToken, ordremissionController.deleteOrdreMission);
ordremissionRoute.put('/update-ordremission/:id', authenticateToken, ordremissionController.updateOrdreMission);

module.exports = ordremissionRoute;
