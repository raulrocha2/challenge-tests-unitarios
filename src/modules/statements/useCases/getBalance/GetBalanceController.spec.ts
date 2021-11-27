import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 } from "uuid";
import { hash } from "bcrypt";


let connection: Connection;

describe("Get Balance Controller", () => {

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

  it("Should be able to get a balance of user ", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "Test deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Test Withdraw"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const response = await request(app)
      .get(`/api/v1/statements/balance`)
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.body.balance).toBe(300);

  });


});