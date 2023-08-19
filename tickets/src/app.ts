import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUserSession } from "@qtiks/common";
import { createTicketRouter } from "./routes/new-ticket";
import { showTicketRouter } from "./routes/show-ticket";
import { indexTicketRouter } from "./routes/index-ticket";
import { updateTicketRouter } from "./routes/update-ticket";

// 243 Reusable header
// remember to delete kubernetes cluster in google cloud console or you will pay for the service

// Nextjs - server side rendering service / framework
// Server Side Rendering (SSR): optimizes SEO performance

const app = express();
// ensure express aware of nginx proxy : trust https traffic
app.set("trust proxy", true);
app.use(json());
// secure sessions package
app.use(
  cookieSession({
    signed: false,
    secure: false //process.env.NODE_ENV != "test"
  })
);
app.use(currentUserSession);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
// Handle bad routes
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
