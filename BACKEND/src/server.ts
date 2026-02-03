import mongoose from 'mongoose';
import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import socketService from './services/SocketService';
import Logger from './utils/Logger';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to DB and Start Server
const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        Logger.info('✅ MongoDB Connected');

        // Check if Redis is connected (optional, but good for debugging since we auto-connect in service)

        const httpServer = http.createServer(app);

        // Initialize Socket.IO
        socketService.init(httpServer);

        httpServer.listen(PORT, () => {
            Logger.info(`🚀 Server running on port ${PORT}`);
        });
    } catch (error: any) {
        Logger.error(`❌ Server Error: ${error.message}`);
        process.exit(1);
    }
};

startServer();
