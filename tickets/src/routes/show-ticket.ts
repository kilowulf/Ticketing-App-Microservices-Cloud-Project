import express, { Request, Response } from "express";
import { NotFoundError } from "@qtiks/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  console.log("Recieved request to show a ticket by id");
  const ticket = await Ticket.findById(req.params.id);
  // check for ticket
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };
