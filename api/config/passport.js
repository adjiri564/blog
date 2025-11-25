const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma= require('../lib/prisma');
require('dotenv').config(); // Ensure JWT_SECRET is loaded

const opts = {
    //This function extracts the JWT from the 'Authorization: Bearer <token>' header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done)=>{
        try {
            // The payload contains the user's id we stored when signing the token
            const user = await prisma.user.findUnique({
                where: { id: jwt_payload.id}
            });
            if(user){
                // if user is found, passport attaches it to the request object (req.user)
                return done(null, user); 
            }
            return done(null, false); // No user found
        } catch (err){
            return done(err, false); // Error occurred
        }
    })
);

module.exports = passport;