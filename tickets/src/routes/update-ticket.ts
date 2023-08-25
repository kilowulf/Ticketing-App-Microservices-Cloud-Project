import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth
} from "@qtiks/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    console.log("Recieved request to update a ticket");
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
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.send(ticket).status(200);
  }
);

export { router as updateTicketRouter };
