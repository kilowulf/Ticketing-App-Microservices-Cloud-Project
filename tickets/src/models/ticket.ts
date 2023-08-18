import mongoose from "mongoose";

// Interface defining properties required for new Ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// interface for building a new Ticket with custom function 'build'
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// interface defines properties of a single Ticket Document:ex. ticket.title, ticket.price. etc..
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// define schema for Ticket
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String, // refers to String class constructor
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    // augments object on Stringify method
    // manipulate / set what properties will be present when created
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

// integrate custom function 'build' as a property for use within Ticket object
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// Generics '<TicketDoc, TicketModel>' allow custom types within models
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
