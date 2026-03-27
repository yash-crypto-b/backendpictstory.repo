const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { story } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        const file = req.files.image;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'picstory',
            resource_type: 'auto'
        });

        // Create post
        const post = await Post.create({
            user: req.user._id,
            imageUrl: result.secure_url,
            story
        });

        // Populate user details
        await post.populate('user', 'username profilePicture');

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate('user', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked the post
        const isLiked = post.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike the post
            post.likes = post.likes.filter(
                userId => userId.toString() !== req.user._id.toString()
            );
        } else {
            // Like the post
            post.likes.push(req.user._id);
        }

        await post.save();
        await post.populate('user', 'username profilePicture');

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user._id,
            text,
            username: req.user.username
        };

        post.comments.unshift(comment);
        await post.save();
        await post.populate('user', 'username profilePicture');

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getUserPosts,
    likePost,
    addComment,
    deletePost
};