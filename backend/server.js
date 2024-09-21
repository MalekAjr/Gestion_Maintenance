const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);


const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static('public'));
app.use('/usersImages', express.static(path.join(__dirname, 'public', 'usersImages')));
app.use('/piecesImages', express.static(path.join(__dirname, 'public', 'piecesImages')));
app.use('/fichesImages', express.static(path.join(__dirname, 'public', 'fichesImages')));

app.use(cors({ origin: '*' }));



mongoose.connect("mongodb+srv://baabadevs:admin123@mernapp.gendjkv.mongodb.net/Gestion_Maintenance")
    .then(() => {
        console.log("Connected to mongoose");

        // Require routes after successful connection
        const fiche_route = require('./routes/ficheinterventionRoute');
        app.use('/api', fiche_route);
        const userrouter = require('./routes/userRoute');
        app.use('/api', userrouter);
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

const PORT = 8000;


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
