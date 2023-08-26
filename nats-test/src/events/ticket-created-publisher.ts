import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-created-event";
import { channelSubjects } from "./channel-subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  channelName: channelSubjects.TicketCreated = channelSubjects.TicketCreated;
}
