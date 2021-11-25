import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";



let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });


  it("Should be able to Authenticate a user", async () => {

    const user: ICreateUserDTO = {
      email: "authenticate@email.com",
      name: "Test Authenticate",
      password: "password123"
    }

    await createUserUseCase.execute(user)

    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userAuthenticate).toHaveProperty("token");
  });

  it("Should not be able to Authenticate a user if not exists", async () => {

    expect(async () => {

      const userAuthenticate = await authenticateUserUseCase.execute({
        email: 'wrong@email.com',
        password: 'pawdWrong',
      });
    }).rejects.toBeInstanceOf(AppError);

  });

  it("Should not be able to Authenticate a user with incorrect password", async () => {

    expect(async () => {

      const user: ICreateUserDTO = {
        email: "authenticate_password@email.com",
        name: "Test Authenticate",
        password: "password123"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'pawdWrong',
      });

    }).rejects.toBeInstanceOf(AppError);

  });

  it("Should not be able to Authenticate a user with incorrect email", async () => {

    expect(async () => {

      const user: ICreateUserDTO = {
        email: "authenticate_email@email.com",
        name: "Test Authenticate",
        password: "password123"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: user.password,
      });

    }).rejects.toBeInstanceOf(AppError);

  });


});