// routes/mailRoute.js
const express = require('express');
const mailController = require('../controllers/mailController'); // Ensure the path is correct
const mailrouter = express.Router();

mailrouter.post('/user/sendmail', mailController.sendmail);
mailrouter.post('/product/getbill', mailController.getbill);

module.exports = mailrouter;
