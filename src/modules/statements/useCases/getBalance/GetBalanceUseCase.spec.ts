import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  });


  it("Should be able to get a balance ", async () => {

    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "Test Name",
      password: "password123"
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    await createStatementUseCase.execute({

      user_id: userCreated?.id as string,
      description: "Test Statement Get Balance",
      amount: 500,
      type: "deposit" as OperationType,

    });

    const getBalance = await getBalanceUseCase.execute({ user_id: userCreated?.id as string });

    expect(getBalance.balance).toBe(500);
  });

  it("Should not be able to get a  if user not exist ", async () => {

    expect(async () => {

      await getBalanceUseCase.execute({ user_id: 'wrong-id-123' });

    }).rejects.toBeInstanceOf(AppError);
  });

});