import { Publisher, channelSubjects, TicketCreatedEvent } from "@qtiks/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  channelName: channelSubjects.TicketCreated = channelSubjects.TicketCreated;
}
