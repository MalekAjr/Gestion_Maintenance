const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const socketIo = require('socket.io');

// Configurer CORS pour autoriser toutes les requêtes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Définir les dossiers statiques
app.use(express.static('public'));
app.use('/usersImages', express.static(path.join(__dirname, 'public', 'usersImages')));
app.use('/piecesImages', express.static(path.join(__dirname, 'public', 'piecesImages')));
app.use('/fichesImages', express.static(path.join(__dirname, 'public', 'fichesImages')));

// Route de test pour vérifier le bon fonctionnement du serveur
app.get('/', (req, res) => {
    res.send('Backend for Gestion Maintenance API is running.');
});

// Connexion à la base de données MongoDB
mongoose.connect("mongodb+srv://baabadevs:admin123@mernapp.gendjkv.mongodb.net/Gestion_Maintenance")
    .then(() => {
        console.log("Connected to mongoose");

        // Importer les routes après la connexion réussie
        const fiche_route = require('./routes/ficheinterventionRoute');
        app.use('/api', fiche_route);
        const userrouter = require('./routes/userRoute');
        app.use( userrouter);
        const eventrouter = require('./routes/eventRoute');
        app.use('/api', eventrouter);
        const carrouter = require('./routes/carRoute');
        app.use('/api', carrouter);
        const ordremissionrouter = require('./routes/ordremissionRoute');
        app.use('/api', ordremissionrouter);
        const ticketrouter = require('./routes/ticketRoute');
        app.use('/api', ticketrouter);
        const mailrouter = require('./routes/mailRoute');
        app.use('/api', mailrouter);
        const notificationrouter = require('./routes/notificationRoute');
        app.use('/api', notificationrouter);
    })
    .catch(error => {
        console.error("Error connecting to mongoose:", error);
    });

// Supprimer l'écoute explicite du serveur
/*
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
*/

// Configuration de Socket.IO
const io = socketIo({
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Exporter l'application pour Vercel
module.exports = app;
