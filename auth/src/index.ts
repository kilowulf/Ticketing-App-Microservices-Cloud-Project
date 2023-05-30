import express from "express";
import { json } from "body-parser";
// 001 creating route handlers
// remember to delete kubernetes cluster in google cloud console or you will pay for the service

const PORT = 3000;

const app = express();
app.use(json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("Hi there!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!!!`);
});
