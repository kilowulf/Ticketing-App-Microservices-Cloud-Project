import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ConnectOptions } from "mongoose";

import { app } from "../app";

/**
 * MongoMemoryServer: allow for running instances for testing suites
 * - Direct Access to our MongoDB database
 *
 * **/
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = new MongoMemoryServer();
  await mongo.start();

  const mongoUri = await mongo.getUri();

  // Connect to the MongoMemoryServer
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Clear data from test collection
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
