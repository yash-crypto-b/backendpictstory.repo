const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl:{
        type : String,
        required:[true,'Image is required']
    },
    story:{
        type : String,
        required:[true,'Story is required'],
        maxlength:[1000,'Story cannot exceed 1000 characters']
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    text:{
        type : String,
        required: true
    },
    username:{
        type: String,
        required:true
    },
    createdAt:{
        type : Date,
        default: Date.now
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Post',postSchema);