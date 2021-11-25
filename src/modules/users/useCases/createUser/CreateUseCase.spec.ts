import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("CreateUser", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });


  it("Should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "Test Name",
      password: "password123"
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user if user already exists", async () => {

    expect(async () => {

      await createUserUseCase.execute({
        email: "user.exist@email.com",
        name: "Test User Exist",
        password: "password123"
      });

      await createUserUseCase.execute({
        email: "user.exist@email.com",
        name: "Test User Exist",
        password: "password123"
      });


    }).rejects.toBeInstanceOf(AppError);

  });

})