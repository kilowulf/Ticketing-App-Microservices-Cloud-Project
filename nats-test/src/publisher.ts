import nats from "node-nats-streaming";

console.clear();
/**
 * .connect method: creates a client connection to the NATS streaming server called ticketing
 *                 with a client ID of "abc". No duplicate Id's allowed in Nats streaming server
 *
 * .publish method: publishes a message to the NATS streaming server on a channel called "ticket:created"
 *                  sends "data"
 *
 */

// nats client is created: "stan" is the typical convention used.
const stan_client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222"
});

stan_client.on("connect", () => {
  console.log("Publisher connected to NATS");

  // "message" is created
  const data = JSON.stringify({
    id: "123",
    title: "Concert",
    price: 20
  });

  // "message" is published and sent off
  stan_client.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
