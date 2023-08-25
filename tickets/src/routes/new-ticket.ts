import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@qtiks/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("Recieved request to create a new ticket");
    const { title, price } = req.body;
    const userId = req.currentUser!.id;

    // call to our Ticket model build function: create a new Ticket
    const ticket = Ticket.build({
      title,
      price,
      userId
    });
    // save ticket to collection
    await ticket.save();

    // publish new ticket created event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      // pull from the ticket object rather than the request since data maybe different
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
