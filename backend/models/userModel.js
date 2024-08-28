const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:false
    },
    role:{
        type: String,
    },
    
    address: {
        type: String,
        required: false
        },
    contact: {
        type: String,
        required: false
        },
    mileage: {
        type: Number,
        required: false,
        default: 0 // Default mileage value
        },
    }, { timestamps: true });

/*
// Hashing the password before saving to the database
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

*/
/*
// Function to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Invalid credentials');
    }

    return user;
};
*/
  
const User = mongoose.model('User', userSchema);

module.exports = User;
