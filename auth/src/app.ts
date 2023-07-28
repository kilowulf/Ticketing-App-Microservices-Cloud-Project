import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

// 011 JWT Signing keys - issues getting https post to respond on postman or thunder client
// 001 Scope of Testing
// remember to delete kubernetes cluster in google cloud console or you will pay for the service

// Nextjs - server side rendering service / framework

const app = express();
// ensure express aware of nginx proxy : trust https traffic
app.set("trust proxy", true);
app.use(json());
// secure sessions package
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);
// JSON Web token package
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Handle bad routes
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
