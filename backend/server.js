const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// База данных в памяти (в реальном приложении используй MongoDB)
let users = [];
let messages = [];
let chats = [];

// API Routes
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/register', (req, res) => {
    const { phone, username, firstName, lastName } = req.body;
    
    const existingUser = users.find(u => u.phone === phone);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = {
        id: Date.now().toString(),
        phone,
        username: username || user${Date.now()},
        firstName,
        lastName,
        avatar: null,
        online: true,
        lastSeen: new Date()
    };
    
    users.push(user);
    res.json({ user, token: 'fake-jwt-token' });
});

app.post('/api/login', (req, res) => {
    const { phone } = req.body;
    
    const user = users.find(u => u.phone === phone);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.online = true;
    user.lastSeen = new Date();
    
    res.json({ user, token: 'fake-jwt-token' });
});

app.get('/api/chats/:userId', (req, res) => {
    const userChats = chats.filter(chat => 
        chat.participants.includes(req.params.userId)
    );
    res.json(userChats);
});

app.get('/api/messages/:chatId', (req, res) => {
    const chatMessages = messages.filter(msg => 
        msg.chatId === req.params.chatId
    );
    res.json(chatMessages);
});

// WebSocket соединения
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('user_online', (userId) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            user.online = true;
            user.socketId = socket.id;
            io.emit('user_status_changed', { userId, online: true });
        }
    });
    
    socket.on('send_message', (data) => {
        const message = {
            id: Date.now().toString(),
            chatId: data.chatId,
            senderId: data.senderId,
            text: data.text,
            timestamp: new Date(),
            read: false
        };
        
        messages.push(message);
        
        // Отправляем сообщение всем участникам чата
        const chat = chats.find(c => c.id === data.chatId);
        if (chat) {
            chat.lastMessage = message.text;
            chat.lastMessageTime = message.timestamp;
            
            chat.participants.forEach(userId => {
                const user = users.find(u => u.id === userId);
                if (user && user.socketId) {
                    io.to(user.socketId).emit('new_message', message);
                }
            });
        }
    });
    
    socket.on('typing_start', (data) => {
        const chat = chats.find(c => c.id === data.chatId);
        if (chat) {
            chat.participants.forEach(userId => {
                if (userId !== data.userId) {
                    const user = users.find(u => u.id === userId);
                    if (user && user.socketId) {
                        io.to(user.socketId).emit('user_typing', {
                            userId: data.userId,
                            chatId: data.chatId
                        });
                    }
                }
            });
        }
    });
    
    socket.on('typing_stop', (data) => {

const chat = chats.find(c => c.id === data.chatId);
        if (chat) {
            chat.participants.forEach(userId => {
                if (userId !== data.userId) {
                    const user = users.find(u => u.id === userId);
                    if (user && user.socketId) {
                        io.to(user.socketId).emit('user_stop_typing', {
                            userId: data.userId,
                            chatId: data.chatId
                        });
                    }
                }
            });
        }
    });
    
    socket.on('disconnect', () => {
        const user = users.find(u => u.socketId === socket.id);
        if (user) {
            user.online = false;
            user.lastSeen = new Date();
            io.emit('user_status_changed', { userId: user.id, online: false });
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(Server running on port ${PORT});
    console.log(Frontend: http://localhost:${PORT});
});
