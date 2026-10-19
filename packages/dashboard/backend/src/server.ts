import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { connectDB } from './db/connection';
import flowsRouter from './routes/flows';
import { errorHandler } from './middleware/errorHandler';
import { initIO } from './socket';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/flows', flowsRouter);

// WebSocket: salas por flowId (configurado en socket.ts)
initIO(server);

export { initIO };

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
