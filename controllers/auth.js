var crypto = require('crypto');
const sendEmail = require('../utils/sendEmail')
const geocoder = require('../utils/goecoder');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public

exports.register = async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res)
}

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    // Validate email & password
    if(!email || !password){
        return res.status(400).json({sucess : false, message : 'Please provide an email and password'});
    }

    //Check for user
    const user = await User.findOne({ email }).select('+pasaword');

    if(!user){
        return res.status(400).json({sucess : false, meassage : 'Invalid password'});
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(400).json({sucess : false, message : 'Invalid password'})
    } 

    // Create Token
    sendTokenResponse(user, 200, res)
}

// @desc   Get current Logged in User
// @route   POST /api/v1/auth/me
// @access  Private
exports.getme = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(
        {
            sucess : true, 
            data : user
        }
    );
}

// @desc   Forget Password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
      return res.status(400).json({
            sucess : false,
            message : 'There is no user with that email'
        });
    }

    //  Get reset Token
    const resetToken = user.getResetPasswordToken(); 

    await user.save({validateBeforeSave : false});

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the password, please make a PUT request to : \n\n ${resetUrl}`;
    
    try {
        await sendEmail({
            email : user.email,
            subject : 'Password reset token',
            message
        });
        res.status(200).json({sucess : true, data : 'Email sent'});
    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});
        return res.status(500).json('Email could not be sent');
    }
}

// @desc   Reset Password
// @route   Put/api/v1/auth/resetPassword/:resettoken
// @access  public
exports.resetPassword = async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire : {$gt : Date.now()}
    });

    if(!user){
        return res.status(400).json({sucess : false, message : 'Invalid token'});
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res)
}


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
 
    const options = {
        expires : new Date(Date.now() + process.JWT_COOKIE_EPIRE * 24 * 60* 60 * 1000),
        httpOnly : true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({sucess : true, token});
}

