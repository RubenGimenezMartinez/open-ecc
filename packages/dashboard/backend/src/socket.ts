import { Server as IOServer } from 'socket.io';
import http from 'http';

export const createIO = (server: http.Server): IOServer =>
  new IOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

export let io: IOServer | null = null;

export const initIO = (server: http.Server): IOServer => {
  io = createIO(server);

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

  return io;
};
