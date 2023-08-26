import { Publisher, channelSubjects, TicketUpdatedEvent } from "@qtiks/common";
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  channelName: channelSubjects.TicketUpdated = channelSubjects.TicketUpdated;
}
