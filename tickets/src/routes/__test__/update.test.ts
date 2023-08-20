import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { globalCustom } from "../../test/setup";

it("returns a 404 if the provided id does not exist", async () => {
  // authenticate user with valid session cookie
  const cookie = await globalCustom.signin();
  // generate valid mongoose object id
  const id = new mongoose.Types.ObjectId().toHexString();
  // send request
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "asvnjejovjn",
      price: 23
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asvnjejovjn",
      price: 23
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  // authenticate user with valid session cookie
  const cookie = await globalCustom.signin();
  const cookie2 = await globalCustom.signin();

  // send request
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asvnjejovjn",
      price: 23
    });

  // check response by sending request with different id and different object data
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie2)
    .send({
      title: "afeknfeo",
      price: 1000
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  // authenticate user with valid session cookie
  const cookie = await globalCustom.signin();

  // send request
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asvnjejovjn",
      price: 23
    });

  // check for invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20
    })
    .expect(400);

  // check for invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "rhthrnh",
      price: -23
    })
    .expect(400);
});

it("updates ticket provided valid inputs", async () => {
  // authenticate user with valid session cookie
  const cookie = await globalCustom.signin();

  // send request
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asvnjejovjn",
      price: 23
    });

  // find existing ticket and update it with new values
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100
    })
    .expect(200);

  // confirm the ticket has been updated with new values
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
