const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
require('dotenv').config();
const connections = require('./config/dbconfig')
const userRoute = require('./routes/user.Route')
const productRoute = require('./routes/products.Routes')
const bidsRoute = require('./routes/bids.Routes')
const notificationRoute = require('./routes/notification.Routes')
const chatRoute = require('./routes/chat.Routes')
const broadcastRoute = require('./routes/broadcast.Routes')

const port = process.env.PORT || 8080;

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/bids', bidsRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/chats', chatRoute);
app.use('/api/broadcasts', broadcastRoute);

// Create HTTP server and Socket.IO for real-time chat
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('join-chat', (chatId) => {
        socket.join(chatId);
    });
    socket.on('send-message', ({ chatId, message }) => {
        io.to(chatId).emit('receive-message', message);
    });
    socket.on('disconnect', () => {});
});

// deployment configuration
const path = require('path');
__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

server.listen(port, () => console.log(`listening on port number ${port}`));