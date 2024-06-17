const express = require('express');
const fiche_route = express.Router();

const bodyParser = require('body-parser');
fiche_route.use(bodyParser.json());
fiche_route.use(bodyParser.urlencoded({extended:true}));

const multer = require('multer');
const path = require('path');

const fichecontroller = require('../controllers/ficheController')
const authenticateToken = require('../middleware/requireAuth');


const storagefiche = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/fichesImages/'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploadfiche = multer({ storage: storagefiche });

fiche_route.post('/create-fiche', authenticateToken, uploadfiche.single('image'), fichecontroller.createFiche);

 fiche_route.get('/get-fiches', authenticateToken, fichecontroller.getFiches);
 fiche_route.get('/get-ficheuser', authenticateToken, fichecontroller.getFicheUser);
 fiche_route.get('/get-ficheuser/:id', authenticateToken, fichecontroller.getFicheByID);
 fiche_route.get('/get-fiches-demandes', authenticateToken, fichecontroller.getFichesDemandes);
 // fiche_route.get('/get-fiches-demandes-clients', authenticateToken, fichecontroller.getFichesDemandesParClient);

 
fiche_route.delete('/delete-fiche/:id', authenticateToken, fichecontroller.deleteFiche);
fiche_route.put('/update-fiche/:id', authenticateToken, uploadfiche.single('image'), fichecontroller.updateFiche);

module.exports = fiche_route;