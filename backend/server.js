const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/usersImages', express.static(path.join(__dirname, 'public', 'usersImages')));
app.use('/piecesImages', express.static(path.join(__dirname, 'public', 'piecesImages')));
app.use('/fichesImages', express.static(path.join(__dirname, 'public', 'fichesImages')));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

mongoose.connect("mongodb+srv://baabadevs:admin123@mernapp.gendjkv.mongodb.net/Gestion_Maintenance")
    .then(() => {
        console.log("Connected to mongoose");

        // Require routes after successful connection
        const fiche_route = require('./routes/ficheinterventionRoute');
        const userrouter = require('./routes/userRoute');
        const eventrouter = require('./routes/eventRoute');
        const carrouter = require('./routes/carRoute');
        const ordremissionrouter = require('./routes/ordremissionRoute');
        const ticketrouter = require('./routes/ticketRoute');
        const mailrouter = require('./routes/mailRoute');
        const notificationrouter = require('./routes/notificationRoute');

        app.use('/api/fiche', fiche_route);
        app.use('/api/user', userrouter);
        app.use('/api/event', eventrouter);
        app.use('/api/car', carrouter);
        app.use('/api/ordremission', ordremissionrouter);
        app.use('/api/ticket', ticketrouter);
        app.use('/api/mail', mailrouter);
        app.use('/api/notification', notificationrouter);

        app.set('io', io);
    })
    .catch(error => {
        console.error("Error connecting to mongoose:", error);
    });

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Middleware pour gérer les requêtes 404
app.use((req, res) => {
    res.status(404).send('404: Not Found');
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
