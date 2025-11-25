const express = require('express');
//mergeParams allows access params from the parent router
const router = express.Router({mergeParams: true});
const commentController = require('../controllers/commentController')

// GET all comments for a specific post
router.get('/', commentController.getCommentsForPost);

// POST a new comment on a specific post
router.post('/', commentController.createComment);

// DELETE a comment (Protected)
// We need a unique identifier for the comment itself
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;