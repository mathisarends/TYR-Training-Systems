const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String, // You can use this field to represent the status of the friendship (e.g., 'pending', 'accepted', etc.)
        default: 'pending'
    }
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = Friendship;