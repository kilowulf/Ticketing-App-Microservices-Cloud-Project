import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

// Define a custom interface for the global object
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
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
globalCustom.signin = async () => {
  // build a JWT payload. {id, email}
  const payload = {
    // generate random id
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  };

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  // supertest requires cookies be contained within an array
  return [`session=${base64}`];
};
