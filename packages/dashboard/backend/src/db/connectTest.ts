import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const connectTestDB = async (): Promise<void> => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDB = async (): Promise<void> => {
  await mongoose.disconnect();
  await mongod?.stop();
};
