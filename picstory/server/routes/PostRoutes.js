const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    getUserPosts,
    likePost,
    addComment,
    deletePost
} = require('../controller/PostControllers');
const { protect } = require('../middleware/Auth.js');

// Get all posts
router.get('/', getAllPosts);
// Get post by ID
router.get('/:id', getPostById);
// Get user posts
router.get('/user/:userId', getUserPosts);
// Create post
router.post('/', protect, createPost);
// Like post
router.put('/:id/like', protect, likePost);
// Add comment
router.post('/:id/comment', protect, addComment);
// Delete post
router.delete('/:id', protect, deletePost);

module.exports = router;
 