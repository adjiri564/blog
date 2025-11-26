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

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Your local public client
  'http://localhost:5174', // Your local admin client
  'https://blog-public-wine.vercel.app', // <-- THIS IS THE CRUCIAL ADDITION
  // You should also add your admin site's URL here once it's deployed
  // e.g., 'https://your-admin-app-url.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(passport.initialize())

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Blog API! The server is running.',
    status: 'ok'
  });
});

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