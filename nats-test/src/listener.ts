import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

// new Client created with random id:
const id = randomBytes(4).toString("hex");
const stan_client = nats.connect("ticketing", id, {
  url: "http://localhost:4222"
});

stan_client.on("connect", () => {
  console.log(`Listener connected to NATS on channel ID: ${id}`);

  stan_client.on("close", () => {
    console.log("NATS connection closed!");
    process.exit(); // exit process if connection is closed
  });

  new TicketCreatedListener(stan_client).listen();

  // set options:
  // setManualAckMode to true to force client to acknowledge events
  // const options = stan_client
  //   .subscriptionOptions()
  //   .setManualAckMode(true) // set automatic acknowledgement mode
  //   .setDeliverAllAvailable() // set to deliver all available events
  //   .setDurableName("accounting-service"); //set subscription specific name to track subscription events

  // listener client subscribes to channel created in publisher
  // specify QueueGroup to prevent multiple listeners from receiving the same event
  // const subscription = stan_client.subscribe(
  //   "ticket:created",
  //   "orders-service-queue-group",
  //   options
  // );

  // listen to events from channel
  // subscription.on("message", (msg: Message) => {
  //   const data_msg = msg.getData();

  //   // check data type
  //   if (typeof data_msg === "string") {
  //     console.log(
  //       `Recieved event #${msg.getSequence()}, with data: ${data_msg}`
  //     );
  //   }
  //   // listener confirms receipt of event and ceases forwarding on queue
  //   msg.ack();
  // });
});

// catch interrupts or terminations of channel process
process.on("SIGINT", () => {
  stan_client.close();
});
process.on("SIGTERM", () => {
  stan_client.close();
});
