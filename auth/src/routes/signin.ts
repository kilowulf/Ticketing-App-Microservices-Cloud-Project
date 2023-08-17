import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { hashPassword } from "../services/hash-password";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "@qtiks/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // query DB for existingUser email
    const existingUser = await User.findOne({ email });
    // check if existingUser exists
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    // authenticate password
    const passwordMatch = await hashPassword.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    // if authenticate , then we send a Json web token
    const existingUserJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email
      },
      process.env.JWT_KEY! //"asdf"exclamation tells typescript we ensure the variable exists
    );

    // Store JWT on session object. explicit property set
    req.session = {
      jwt: existingUserJwt
    };

    // successful request
    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
