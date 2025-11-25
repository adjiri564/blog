const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const passport = require('passport');
const checkAuth = require('../middleware/checkAuth'); // import the new middleware




// Use our custom middleware for the GET all posts route
router.get('/', checkAuth, postController.getAllPosts);

// Also apply checkAuth to the GET single post route
router.get('/:id', checkAuth, postController.getPostById);

// Protected routes below (auth needed)

const auth = passport.authenticate('jwt', { session: false });
router.post('/', auth, postController.createPost);

// Update a post
router.put('/:id', auth, postController.updatePost);

// Delete a post
router.delete('/:id', auth, postController.deletePost);

module.exports = router;

