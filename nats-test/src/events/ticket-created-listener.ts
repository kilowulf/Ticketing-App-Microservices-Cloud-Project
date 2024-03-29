import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-event";
import { channelSubjects } from "./channel-subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // readonly: prevents class property from being changed
  // channelName: enum of channelSubjects
  channelName: channelSubjects.TicketCreated = channelSubjects.TicketCreated;
  queueGroupName = "payments-service";

  // typeset data, Message
  // deliver Event scope information
  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log(`Event data: ${JSON.stringify(data)}`);

    msg.ack();
  }
}
