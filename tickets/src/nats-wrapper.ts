import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }

  disconnect() {
    if (this._client) {
      this._client.close();
    }
  }
}

// Code snippet from e:\Programming Projects\Javascript\Microservices_React_js_course\Ticketing_app\common\src\events\listeners\base-listener.ts
// import { Message, Stan } from "node-nats-streaming";
// import { Subjects

export const natsWrapper = new NatsWrapper();
