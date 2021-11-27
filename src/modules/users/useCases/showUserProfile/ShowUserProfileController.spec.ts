import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 } from "uuid";
import { hash } from "bcrypt";

let connection: Connection;

describe("Create User Controller", () => {

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

  it("Should be able to show a user profile", async () => {

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@finapi.com",
        password: "admin_fin_api"
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile/")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.body.name).toBe("admin");
    expect(response.status).toBe(200);

  });

  it("Should not be able to show a user profile if user not authenticated or token expired", async () => {

    const response = await request(app)
      .get("/api/v1/profile/")
      .set({
        Authorization: `Bearer wrong-token-123123`
      });

    expect(response.status).toBe(401);

  });
});