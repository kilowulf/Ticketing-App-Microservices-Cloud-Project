import { Publisher, channelSubjects, TicketUpdatedEvent } from "@qtiks/common";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly channelName = channelSubjects.TicketUpdated;
}
