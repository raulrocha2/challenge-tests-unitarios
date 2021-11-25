import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });


  it("Should be able to create a new statement type deposit", async () => {

    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "Test Name",
      password: "password123"
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const statementDeposit = await createStatementUseCase.execute({

      user_id: userCreated?.id as string,
      description: "Test Statement Deposit",
      amount: 500,
      type: "deposit" as OperationType,

    });

    expect(statementDeposit).toHaveProperty("id");
  });

  it("Should be able to create a new statement type withdraw", async () => {

    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "Test Name",
      password: "password123"
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    await createStatementUseCase.execute({

      user_id: userCreated?.id as string,
      description: "Test Statement Deposit",
      amount: 500,
      type: "deposit" as OperationType,

    });

    const statementWithdraw = await createStatementUseCase.execute({

      user_id: userCreated?.id as string,
      description: "Test Statement withdraw",
      amount: 200,
      type: "withdraw" as OperationType,

    });

    expect(statementWithdraw).toHaveProperty("id");
  });

  it("Should not be able to create a new statement if user not exist ", async () => {

    expect(async () => {

      await createStatementUseCase.execute({

        user_id: 'wrong-id-123',
        description: "Test Statement Deposit",
        amount: 500,
        type: "deposit" as OperationType,

      });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create a new statement withdraw if Insufficient funds", async () => {

    expect(async () => {

      const user = await createUserUseCase.execute({
        email: "test_withdraw@email.com",
        name: "Test Withdraw wrong",
        password: "password123"
      });

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      await createStatementUseCase.execute({

        user_id: userCreated?.id as string,
        description: "Test Statement withdraw",
        amount: 200,
        type: "withdraw" as OperationType,

      });

    }).rejects.toBeInstanceOf(AppError);

  });


});