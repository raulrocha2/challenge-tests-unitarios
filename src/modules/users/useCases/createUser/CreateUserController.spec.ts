import request from "supertest";
import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import { v4 } from "uuid";
import { hash } from "bcrypt";

let connection: Connection;

describe("Create a User Controller", () => {

  beforeAll(async () => {

    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new user", async () => {

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "Test Create Name",
        email: "test@email.com",
        password: "password12313"
      });

    expect(response.status).toBe(201);
  });

});