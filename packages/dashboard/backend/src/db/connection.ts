import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI no está definido en las variables de entorno');
}

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('[DB] Conectado a MongoDB');
  } catch (error) {
    console.error('[DB] Error conectando a MongoDB:', error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[DB] Desconectado de MongoDB');
  } catch (error) {
    console.error('[DB] Error desconectando de MongoDB:', error);
    throw error;
  }
};

export default mongoose;
