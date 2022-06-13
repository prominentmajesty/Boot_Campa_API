const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect route

exports.protect = async () => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split()[1];
    }

    // Make sure cookie exist
    if(!token){
        return res.status(401).json({sucess : false, message : 'Not Authorized to access this route'});
    }

    try{
            // veryfy token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);

            req.User = await User.findById(decoded.id);
            next();

        }catch(err){
            console.log(err);
            return res.status(401).json({sucess : false, message : 'Not Authorized to access this route'});
        }
}

// Grant Access to specific roles
exports.authorize = (...roles) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            res.status(403).json(`User role ${req.user.role} is not authorized to acess this route`);
        }
        next();
    }
} 