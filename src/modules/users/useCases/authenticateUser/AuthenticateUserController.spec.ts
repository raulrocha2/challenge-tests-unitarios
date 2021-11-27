import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 } from "uuid";
import { hash } from "bcrypt";

let connection: Connection;

describe("Authenciate User Controller", () => {

  beforeAll(async () => {

    connection = await createConnection();
    await connection.runMigrations();

    const id = v4();
    const password = await hash("admin_fin_api", 10);

    await connection.query(
      ` INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      VALUES('${id}', 'admin', 'admin@finapi.com', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to authenticated a user", async () => {

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    expect(response.status).toBe(200);

  });


  it("Should be able to get token of user authenticated", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    expect(responseToken.body).toHaveProperty("token");

  });

  it("Should not be able to authenticated a user with email or password incorrect", async () => {

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "wrong@finapi.com",
        password: "wrongpassword"
      })

    expect(response.status).toBe(401);
  });
});