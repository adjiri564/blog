const prisma = require('../lib/prisma');

//Get /posts/:postId/comments
exports.getCommentsForPost = async (req,res,next)=>{
    try{
        const {postId} = req.params;
        const comments = await prisma.comment.findMany({
            where: {postId},
            orderBy: {createdAt: 'asc'},
        });
        res.json(comments);
    } catch(err){
        next(err);
    }
};

//Post /posts/:postId/comments
exports.createComment = async (req,res,next)=>{
    try{
        const {postId} = req.params;
        const {content, authorName} = req.body;
        const newComment = await prisma.comment.create({
            data: {content, authorName, postId},
        });
        res.status(201).json(newComment);
    } catch(err){
        next(err);
    }
};

// DELETE /posts/:postId/comments/:commentId (Protected)
exports.deleteComment = async (req, res, next) => {
    try {
    const { commentId } = req.params;
    await prisma.comment.delete({
        where: { id: commentId },
    });
    res.status(204).send(); // No Content
    } catch (error) {
    next(error);
    }
};  