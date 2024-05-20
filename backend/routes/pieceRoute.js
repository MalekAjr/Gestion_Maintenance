const express = require('express');
const piece_route = express.Router();

const bodyParser = require('body-parser');
piece_route.use(bodyParser.json());
piece_route.use(bodyParser.urlencoded({extended:true}));

const multer = require('multer');
const path = require('path');

const piececontroller = require('../controllers/pieceController')
// const authenticateToken = require('../middleware/requireAuth');


const storagepieces = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/piecesImages/'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const uploadpiece = multer({ storage: storagepieces });

piece_route.post('/create-piece', uploadpiece.single('image'), piececontroller.createPiece);

piece_route.get('/get-pieces', piececontroller.getPieces);
piece_route.get('/delete-piece/:id', piececontroller.deletePiece);
piece_route.put('/update-piece/:id', uploadpiece.single('image'), piececontroller.updatePiece);

module.exports = piece_route;