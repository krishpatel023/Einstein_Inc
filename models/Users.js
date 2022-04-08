const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Enter A Name'],
    },
    email:{
        type: String,
        required: [true, 'Please Enter An Email Address'],
        unique:true,
        lowercase:true,
        validate: [(val) => { isEmail }, 'Please enter a valid Email Address']
    },
    password:{
        type: String,
        required: [true, 'Please Enter A Password'],
        minlength: [8, 'Minimum password length is 8 character']
    }
});

//Password Hashing
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function( email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email')
};

userSchema.statics.idReturn = async function(email) {
    const user = await this.findOne({ email });
    if (user) {
        // console.log('trial');
        // console.log(user);
        return user;

        
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;

