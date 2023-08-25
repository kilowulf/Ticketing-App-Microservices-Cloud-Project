import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  // find all ticket documents in collection
  console.log("Recieved request to show all tickets");
  const tickets = await Ticket.find({});
  // console.log(tickets);

  res.send(tickets).status(200);
});

export { router as indexTicketRouter };
