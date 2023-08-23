import { channelSubjects } from "./channel-subjects";

export interface TicketCreatedEvent {
  channelName: channelSubjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
