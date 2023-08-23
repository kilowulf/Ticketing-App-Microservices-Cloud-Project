import { Stan } from "node-nats-streaming";
import { channelSubjects } from "./channel-subjects";

interface Event {
    channelName: channelSubjects;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract channelName: T["channelName"];
    protected client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T["data"]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.channelName, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log("Event published to channel", this.channelName);
                resolve();
            });
        });
    }


}