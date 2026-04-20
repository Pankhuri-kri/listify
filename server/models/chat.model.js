const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    messages: [messageSchema],
    lastMessage: {
        type: String,
        default: '',
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Ensure one chat per buyer-seller-product combination
chatSchema.index({ product: 1, buyer: 1, seller: 1 }, { unique: true });

const ChatModel = mongoose.model('Chat', chatSchema);
module.exports = ChatModel;
