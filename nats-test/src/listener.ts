import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// new Client created with random id:
const id = randomBytes(4).toString("hex");
const stan_client = nats.connect("ticketing", id, {
  url: "http://localhost:4222"
});

stan_client.on("connect", () => {
  console.log(`Listener connected to NATS on channel ID: ${id}`);

  // set options:
  // setManualAckMode to true to force client to acknowledge events
  const options = stan_client.subscriptionOptions().setManualAckMode(true);

  // listener client subscribes to channel created in publisher
  // specify QueueGroup to prevent multiple listeners from receiving the same event
  const subscription = stan_client.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  // listen to events from channel
  subscription.on("message", (msg: Message) => {
    const data_msg = msg.getData();

    // check data type
    if (typeof data_msg === "string") {
      console.log(
        `Recieved event #${msg.getSequence()}, with data: ${data_msg}`
      );
    }
    // listener confirms receipt of event and ceases forwarding on queue
    msg.ack();
  });
});
