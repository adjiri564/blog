const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Post /auth/sign-up
exports.signUp = async (req,res,next)=>{
    try{
        const {username, email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data: {username, email, password:hashedPassword},
        });
        res.status(201).json({message: 'User created successfully', userId: user.id})
    }catch(err){
        if(err.code ==='P2002'){
          // Prisma's P2002 is for unique constraint violations
      // We can check which field caused it  
        const field = err.meta.target.includes('username') ? 'Username' : 'Email';
        return res.status(400).json({message: `${field} already in use`});  
        }
        next(err);
    }
};

//Post /auth/login
exports.logIn = async (req,res,next)=>{
    try{
        const {username, password} = req.body;
        const user = await prisma.user.findUnique({where: { username }});
        if(!user){
        return res.status(401).json({message: 'Authentication failed'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
        return res.status(401).json({message: 'Authentication failed'});
        }
        const payload = {
        id: user.id,
        username: user.username,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h', //token expires in 1 hour//
        });
        res.json({message: 'Login successful', token})
    } catch(err){
        next(err);
    }
}