const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('post-created', (post) => {
    console.log('New post created:', post.id);
    socket.broadcast.emit('post-created', post);
  });

  socket.on('comment-created', ({ postId, comment }) => {
    console.log('New comment created on post:', postId);
    socket.broadcast.emit('comment-created', { postId, comment });
  });

  socket.on('like-updated', ({ postId, likes }) => {
    console.log('Likes updated on post:', postId);
    socket.broadcast.emit('like-updated', { postId, likes });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
}); 