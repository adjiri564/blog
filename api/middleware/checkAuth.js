const passport = require('passport');

// this middleware will try to authenticate the user using JWT strategy
// if successful, req.user will be populated
// if not, it will simply continue to the next middleware without error

const checkAuth = (req,res,next)=>{
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(err){
            return next(err);
        }
        if(user){
            req.user = user; // attach user to the request
        }
        next(); // always proceed
    })(req,res,next);

}

module.exports = checkAuth;