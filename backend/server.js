const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
const path = require('path'); 
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
        const mailrouter = require('./routes/mailRoute'); // Ensure the path is correct
        app.use('/api', mailrouter);
    })
    .catch(error => {
        console.error("Error connecting to mongoose:", error);
    });


const PORT = 8000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
