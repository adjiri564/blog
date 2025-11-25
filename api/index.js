require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport')

//Import routes
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(passport.initialize())

//Routes
app.use('/auth', authRouter);
app.use('/posts', postRouter);
// Note: Comments are nested under posts, but we can have a separate router for clarity
app.use('/posts/:postId/comments', commentRouter)

//Basic error handling
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('Server is running on port', PORT)
})