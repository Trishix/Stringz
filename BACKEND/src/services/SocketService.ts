import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

class SocketService {
    private static instance: SocketService;
    private io: SocketIOServer | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public init(httpServer: HttpServer): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.CLIENT_URL || '*',
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket) => {
            console.log('🔌 Socket Connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('🔌 Socket Disconnected:', socket.id);
            });
        });

        console.log('✅ Socket.IO Initialized');
    }

    public getIO(): SocketIOServer {
        if (!this.io) {
            throw new Error('Socket.IO not initialized');
        }
        return this.io;
    }

    public emit(event: string, data: any): void {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

export default SocketService.getInstance();
