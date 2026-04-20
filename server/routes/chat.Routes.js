const router = require('express').Router();
const authMiddlewares = require('../middlewares/authMiddlewares');
const ChatModel = require('../models/chat.model');
const ProductModel = require('../models/products.model');

// Start or get existing chat for a product (buyer initiates)
router.post('/start-chat', authMiddlewares, async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.body.userId;

        const product = await ProductModel.findById(productId).populate('seller');
        if (!product) {
            return res.send({ success: false, message: 'Product not found' });
        }

        const sellerId = product.seller._id.toString();

        if (buyerId === sellerId) {
            return res.send({ success: false, message: 'You cannot chat with yourself' });
        }

        // Find or create chat
        let chat = await ChatModel.findOne({
            product: productId,
            buyer: buyerId,
            seller: sellerId,
        }).populate('product seller buyer', 'name email profilePicture images');

        if (!chat) {
            chat = new ChatModel({
                product: productId,
                buyer: buyerId,
                seller: sellerId,
                messages: [],
            });
            await chat.save();
            chat = await ChatModel.findById(chat._id)
                .populate('product', 'name images')
                .populate('seller', 'name email profilePicture')
                .populate('buyer', 'name email profilePicture');
        }

        res.send({ success: true, data: chat });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Send a message in a chat
router.post('/send-message', authMiddlewares, async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.body.userId;

        const chat = await ChatModel.findById(chatId);
        if (!chat) {
            return res.send({ success: false, message: 'Chat not found' });
        }

        // Only buyer or seller can message
        const isMember =
            chat.buyer.toString() === senderId ||
            chat.seller.toString() === senderId;

        if (!isMember) {
            return res.send({ success: false, message: 'Unauthorized' });
        }

        chat.messages.push({ sender: senderId, text });
        chat.lastMessage = text;
        chat.lastMessageAt = new Date();
        await chat.save();

        // Return full populated chat
        const updatedChat = await ChatModel.findById(chatId)
            .populate('product', 'name images')
            .populate('seller', 'name email profilePicture')
            .populate('buyer', 'name email profilePicture')
            .populate('messages.sender', 'name profilePicture');

        res.send({ success: true, data: updatedChat });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Get all chats for the logged-in user (both as buyer and seller)
router.get('/get-my-chats', authMiddlewares, async (req, res) => {
    try {
        const userId = req.body.userId;

        const chats = await ChatModel.find({
            $or: [{ buyer: userId }, { seller: userId }],
        })
            .populate('product', 'name images')
            .populate('seller', 'name email profilePicture')
            .populate('buyer', 'name email profilePicture')
            .sort({ lastMessageAt: -1 });

        res.send({ success: true, data: chats });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Get a single chat with all messages
router.get('/get-chat/:chatId', authMiddlewares, async (req, res) => {
    try {
        const userId = req.body.userId;
        const { chatId } = req.params;

        const chat = await ChatModel.findById(chatId)
            .populate('product', 'name images price')
            .populate('seller', 'name email profilePicture')
            .populate('buyer', 'name email profilePicture')
            .populate('messages.sender', 'name profilePicture');

        if (!chat) {
            return res.send({ success: false, message: 'Chat not found' });
        }

        // Mark messages as read for the current user
        let updated = false;
        chat.messages.forEach((msg) => {
            if (msg.sender._id.toString() !== userId && !msg.read) {
                msg.read = true;
                updated = true;
            }
        });
        if (updated) await chat.save();

        res.send({ success: true, data: chat });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

// Get unread message count for the logged-in user
router.get('/unread-count', authMiddlewares, async (req, res) => {
    try {
        const userId = req.body.userId;

        const chats = await ChatModel.find({
            $or: [{ buyer: userId }, { seller: userId }],
        });

        let count = 0;
        chats.forEach((chat) => {
            chat.messages.forEach((msg) => {
                if (msg.sender.toString() !== userId && !msg.read) {
                    count++;
                }
            });
        });

        res.send({ success: true, data: count });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

module.exports = router;
