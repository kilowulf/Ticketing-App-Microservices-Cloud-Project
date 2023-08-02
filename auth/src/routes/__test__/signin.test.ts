import request from "supertest";
import { app } from "../../app";

// email not in DB
it("fails when a email that is used does not exist in DB", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400);
});

// invalid password used
it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "askfoeejf"
    })
    .expect(400);
});

// cookie returned on valid credentials
it("responds with cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
