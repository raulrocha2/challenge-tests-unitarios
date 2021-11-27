import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 } from "uuid";
import { hash } from "bcrypt";


let connection: Connection;

describe("Create a Statement Controller", () => {

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

  it("Should be able to create a statement deposit", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "Test deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.body.amount).toBe(500)
    expect(response.status).toBe(201);

  });

  it("Should be able to create a statement withdraw", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "Test withdraw"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.body.amount).toBe(500)
    expect(response.status).toBe(201);

  });

  it("Should not be able to create a statement withdraw if Insufficient funds ", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 1000,
        description: "Test withdraw with isufficient funds"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(400);

  });

});