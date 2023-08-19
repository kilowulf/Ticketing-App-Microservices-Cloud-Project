import { app } from "../../app";
import request from "supertest";
import { globalCustom } from "../../test/setup";

// helper function to create test ticket
const createTicket = async () => {
  const cookie = await globalCustom.signin();
  return await request(app).post("/api/tickets").set("Cookie", cookie).send({
    title: "fvemfeo",
    price: 20
  });
};

it("can fetch a list of tickets", async () => {
  // check if ticket was saved
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
