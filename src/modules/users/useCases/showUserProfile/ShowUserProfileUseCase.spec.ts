import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });


  it("Should be able get Profile by User ID", async () => {

    const user = await createUserUseCase.execute({
      email: "test.profile@email.com",
      name: "Test Profile Name",
      password: "password123"
    });

    const userProfile = await showUserProfileUseCase.execute(user.id!)

    expect(userProfile).toHaveProperty("id");
  });

  it("Should not be able get Profile if User not exists", async () => {

    expect(async () => {
      await showUserProfileUseCase.execute('wrong_id_1223123');
    }).rejects.toBeInstanceOf(AppError);
  });

});