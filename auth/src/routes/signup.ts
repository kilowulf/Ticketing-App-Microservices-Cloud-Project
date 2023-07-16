import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
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
  async (req: Request, res: Response) => {
    // pass and assign any errors from validator
    const errors = validationResult(req);

    // if there are errors, throw error
    if (!errors.isEmpty()) {
      // convert errors to array to pass in json
      throw new RequestValidationError(errors.array());
    }

    // Validate whether email already exists within DB
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // Create new user and save to DB
    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
