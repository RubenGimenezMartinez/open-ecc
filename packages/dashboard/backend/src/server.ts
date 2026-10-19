import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import { connectDB } from './db/connection';
import flowsRouter from './routes/flows';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/flows', flowsRouter);

// WebSocket: salas por flowId
io.on('connection', (socket) => {
  console.log('[WS] Cliente conectado:', socket.id);

  socket.on('join-flow', (flowId: string) => {
    socket.join(flowId);
    console.log(`[WS] ${socket.id} se unió al flujo ${flowId}`);
  });

  socket.on('leave-flow', (flowId: string) => {
    socket.leave(flowId);
  });

  socket.on('disconnect', () => {
    console.log('[WS] Cliente desconectado:', socket.id);
  });
});

export { io };

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`[SERVER] Escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[SERVER] Error iniciando:', error);
    process.exit(1);
  }
};

start();
