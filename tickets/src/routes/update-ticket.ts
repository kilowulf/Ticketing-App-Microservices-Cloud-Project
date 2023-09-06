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
    console.log("Received request to update a ticket");

    try {
      const ticket = await Ticket.findById(req.params.id);
      console.log("Ticket found:", ticket);
      console.log("Current user:", req.currentUser);
      console.log("ticket id:", ticket?.id);

      if (!ticket) {
        throw new NotFoundError();
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      ticket.set({
        title: req.body.title,
        price: req.body.price
      });

      await ticket.save();
      console.log("Ticket updated:", ticket);

      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
      });

      res.send(ticket);
    } catch (error) {
      console.error("Error while updating ticket:", error);
      // Handle error accordingly
    }
  }
);

export { router as updateTicketRouter };
