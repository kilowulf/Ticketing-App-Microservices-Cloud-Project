import { Publisher, channelSubjects, TicketCreatedEvent } from "@qtiks/common";
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly channelName = channelSubjects.TicketCreated;
}
