import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 } from "uuid";
import { hash } from "bcrypt";


let connection: Connection;

describe("Create a Transfer Statement Controller", () => {

  beforeAll(async () => {

    connection = await createConnection();
    await connection.runMigrations();

    const sender_id = v4();
    const receive_id = v4();
    const password = await hash("admin_fin_api", 10);

    await connection.query(
      ` INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      VALUES('${sender_id}', 'transfer_sender', 'transfer_send@finapi.com', '${password}', 'now()', 'now()')
      `
    );

    await connection.query(
      ` INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      VALUES('${receive_id}', 'transfer_receive', 'transfer_receive@finapi.com', '${password}', 'now()', 'now()')
      `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a transfer statement ", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "transfer_send@finapi.com",
        password: "admin_fin_api"
      });

    const responseReceiveUser = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "transfer_receive@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    const { user } = responseReceiveUser.body

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "Test deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .post(`/api/v1/statements/transfer/${user.id}`)
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

  it("Should not be able to create a statement transfer if Insufficient funds ", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "transfer_send@finapi.com",
        password: "admin_fin_api"
      });

    const responseReceiveUser = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "transfer_receive@finapi.com",
        password: "admin_fin_api"
      });

    const { user } = responseReceiveUser.body

    const { token } = responseToken.body;

    const response = await request(app)
      .post(`/api/v1/statements/transfer/${user.id}`)
      .send({
        amount: 1000,
        description: "Test transfer with isufficient funds"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(400);

  });

});