const express = require('express');
const userrouter = express.Router();
const userController = require('../controllers/userController');


const bodyParser = require('body-parser');
userrouter.use(bodyParser.json());
userrouter.use(bodyParser.urlencoded({extended:true}));

const multer = require('multer');
const path = require('path');

const authenticateToken = require('../middleware/requireAuth');


// Define multer storage
const storage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/usersImages/'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });



// Route to handle user signup
userrouter.post('/signup', upload.single('image'), userController.signupUser);

// Route to handle user login
userrouter.post('/login', userController.loginUser);

userrouter.get('/user/:id', authenticateToken, userController.getUser);
userrouter.get('/get-users', authenticateToken, userController.getUsers);
userrouter.delete('/delete-user/:id', authenticateToken, userController.deleteUser);
userrouter.put('/update-user/:id', authenticateToken, upload.single('image') , userController.updateUser);
// userrouter.get('/get-techniciens/', authenticateToken, userController.getTechniciens);

userrouter.post('/get-techniciens-sans-evenements', authenticateToken, userController.getTechniciens);
userrouter.get('/get-user', authenticateToken, userController.getUser);

userrouter.get('/details/:clientName', authenticateToken, userController.getClientDetails);
userrouter.get('/get-clients', authenticateToken, userController.getClients);
userrouter.get('/getliste-techniciens', authenticateToken, userController.getListeTechniciens);

module.exports = userrouter;
