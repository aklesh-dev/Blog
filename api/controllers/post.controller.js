import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
    // --if user is not admin, not allowed to create a post--
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allow to create a post'));
    };

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(403, 'Please provides all required fields'));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new Post({ ...req.body, slug, userId: req.user.id });

    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);

    } catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
        }).sort({ updatedAt: sortDirection}).skip(startIndex).limit(limit);

        // --total no of posts present--
        const totalPosts = await Post.countDocuments();

        // --post created last month--
        // --current date--
        const now = new Date(); 
        //--calculating one month ago--
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        ); 

        // --count posts from last month--
        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo, $lt: now}
        });
        
        res.status(200).json({posts, totalPosts, lastMonthPosts });

    } catch (error) {
        next(error);
    }
};