import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import { globalCustom } from "../../test/setup";

it("returns a 404 if the ticket is not found", async () => {
  // generate a authentic mongoose object id
  const id = new mongoose.Types.ObjectId().toHexString();
  // pass id to request
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns a ticket if ticket is found", async () => {
  const cookie = await globalCustom.signin();
  console.log(cookie);
  const title = "asdegef";
  const price = 23;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price
    })
    .expect(201);
  console.log(response.status);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it("returns a 404 if the ticket is not found", async () => {});

it("returns a 404 if the ticket is not found", async () => {});

it("returns a 404 if the ticket is not found", async () => {});
