const prisma = require('../lib/prisma');

// Public/Admin access
//Get /posts
exports.getAllPosts = async (req,res)=>{
    try{
        // if req.user exists, they are an authenticated author
        // so we don't filter by `published: true`
        const whereClause = req.user ? {} : { published: true}
        const posts = await prisma.post.findMany({
            where: whereClause ,
            include: {author: {select: {username: true}} },
            orderBy: { createdAt: 'desc' }, // latest posts first
        });
        res.json(posts);

    } catch(err){
        next(err);
    }
};

// Public/Admin access
// GET /posts/:id
exports.getPostById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id };
    // If no user is logged in, add the requirement that the post must be published
    if (!req.user) {
      whereClause.published = true;
    }

        const post = await prisma.post.findFirst({
      where: whereClause, // Use our dynamic whereClause
            include: {
        author: { select: { username: true } },
                comments: true,
            },
        });
    if (!post) {
      return res.status(404).json({ message: 'Post not found or not published' });
        }
        res.json(post);
  } catch (error) {
    next(error);
    }
};


//Protected routes below(logic implemented, protection to be added)
//Posts /posts
exports.createPost = async (req,res,next)=>{
    try{
        const {title, content} = req.body;
    // The authorId now comes from the authenticated user's token, not the body
    const authorId = req.user.id;
    const newPost = await prisma.post.create({
        data: {title, content, authorId},
        });
    res.status(201).json(newPost)
    } catch (err){
        next(err)
    }
};

//PUT /posts/:id
exports.updatePost = async (req, res, next)=>{
    try{
        const {id: postId} = req.params;
        const {id: userId} = req.user;

        //first, verify the post exists and belongs to the user
        const post = await prisma.post.findFirst({
            where: {id: postId, authorId: userId},
        });
        if(!post){
            return res.status(403).json({message: "Forbidden: You don't own this post or it doesn't exist"});
        }

        //If the check passes, update the post
        const {title, content, published} = req.body;
        const updatePost = await prisma.post.update({
            where: {id: req.params.id},
            data: {title, content, published},
        });
        res.json(updatePost)
    } catch(err){
        next(err)
    }
}

//Delete /post/:id
exports.deletePost = async (req,res,next)=>{
    try{
        const { id: postId } = req.params;
        const { id: userId } = req.user;

        // Verify the post exists and belongs to the user
        const post = await prisma.post.findFirst({
            where: { id: postId, authorId: userId },
        });

        if (!post) {
            return res.status(403).json({ message: "Forbidden: You don't own this post or it doesn't exist." });
        }

        // If the check passes, delete the post
        await prisma.post.delete({
            where: {id: req.params.id},
        });
        res.status(204).send(); // no content
    } catch(err){
        next(err);
    }
};
