import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import { seedDatabaseIfEmpty } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database (Atlas or automatic in-memory MongoDB)
    await connectDB();

    // 2. Automatically seed database if empty for instant ready-to-demo state
    await seedDatabaseIfEmpty();

    // 3. Setup HTTP & WebSocket Server
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      }
    });

    app.set('io', io);
    setupSocketHandlers(io);

    server.listen(PORT, () => {
      console.log(`🚀 SkillBridge Server running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket server active on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
