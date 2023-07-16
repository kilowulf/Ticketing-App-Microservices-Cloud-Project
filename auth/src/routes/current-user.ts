import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send("Hi there!");
  console.log("hi there");
});

export { router as currentUserRouter };
