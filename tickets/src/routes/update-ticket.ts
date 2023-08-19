import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth
} from "@qtiks/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // check if valid ticket exists
    if (!ticket) {
      throw new NotFoundError();
    }

    //   if (ticket.orderId) {
    //     throw new BadRequestError("Cannot edit a reserved ticket");
    //   }

    // authenticate ticket belongs to user
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update document data
    ticket.set({
      title: req.body.title,
      price: req.body.price
    });
    // save to collection
    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
