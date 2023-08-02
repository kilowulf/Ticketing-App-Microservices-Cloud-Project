import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

// Define a custom interface for the global object
declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string[]>;
    }
  }
}

export const globalCustom: any = global;
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

// custom global function for providing validation cookie for testing
globalCustom.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
