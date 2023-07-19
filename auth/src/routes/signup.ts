import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

// Validator helper functions to check email and password
// Import and use req and res descriptors
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Validate whether email already exists within DB
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // Create new user and save to DB
    const user = User.build({ email, password });
    await user.save();

    // generate JSON web token

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY! //"asdf"exclamation tells typescript we ensure the variable exists
    );

    // Store JWT on session object. explicit property set
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
