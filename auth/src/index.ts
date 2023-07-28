import mongoose from "mongoose";
import { app } from "./app";

const PORT = 3000;

// connect to mongodb docker image
const startDb = async () => {
  // check if JWT_KEY is defined in env variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});

startDb();
