import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

// 010 User Creation
// remember to delete kubernetes cluster in google cloud console or you will pay for the service

// Nextjs - server side rendering service / framework

const PORT = 3000;

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Handle bad routes
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

// connect to mongodb docker image
const startDb = async () => {
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
