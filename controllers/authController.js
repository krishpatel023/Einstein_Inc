const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const { findOneAndUpdate } = require('../models/Users');

// Handle Errors
 const handleErrors = (err) => {
     console.log(err.message, err.code);
     let errors = { name: '', email:'',password:''};
    // Incorrect Email

    if(err.message === 'incorrect email') {
        errors.email = 'Email not registered.';
    }
    // Incorrect Password
    if(err.message === 'incorrect password') {
        errors.password = 'Password not registered.';
    }
    //  Duplicate Email
    if(err.code === 11000){
        errors.email = 'This Email is already Taken';
        return errors;
    }
    //Validation Errors
     if(err.message.includes('user validation failed')) {
         
        Object.values(err.errors).forEach(({properties}) => {
             errors[properties.path] = properties.message;
         });
     }
     
     return errors;
}
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'Secret', {
        expiresIn: maxAge
    })
}
// module.exports.course_get = (req, res) => {
//     res.render('course');
// }

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signin_get = (req, res) => {
    res.render('signin');
}
module.exports.dashboardChange_get = (req, res) => {
    res.render('dashboardC');
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;
    
    try{
        const user = await User.create({name, email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000 });
        res.status(201).json({user: user._id});
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login( email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge : maxAge * 1000 });
        res.status(200).json({user: user._id});
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.dashboardChange = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name);
    const nameNew = name;
    const passwordNew = password;

    try {
        const user = await User.idReturn(email);
        // console.log('trial2');
        // console.log(user._id.toString());
        User.updateOne( { _id: user._id.toString()}, { $set: { name: nameNew, password:passwordNew }});
        // User.findByIdAndUpdate( { _id : user._id.toString()}, { name:nameNew}, { new:true});
        
    }
    catch (err) {
        console.log(err);
    }
    
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/');
}


