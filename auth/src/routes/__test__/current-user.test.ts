import request from "supertest";
import { app } from "../../app";
import { globalCustom } from "../../test/setup";

// current user details returned
it("responds with details about current user", async () => {
  const cookie = await globalCustom.signup();
  console.log(cookie);

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

// failed authentication
it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(401);
  console.log(response.body.currentUser);

  expect(response.body.currentUser).toBeUndefined();
});
