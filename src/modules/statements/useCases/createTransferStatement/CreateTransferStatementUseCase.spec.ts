import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";




let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createTransferStatementUseCase: CreateTransferStatementUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = "transfer",
}

describe("Create Statement Transfer", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createTransferStatementUseCase = new CreateTransferStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });


  it("Should be able to create a new statement type transfer", async () => {

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

    const statementDeposit = await createTransferStatementUseCase.execute({

      user_id: userCreated?.id as string,
      sender_id: userCreated?.id as string,
      description: "Test Statement transfer",
      amount: 500,
      type: "transfer" as OperationType,

    });

    expect(statementDeposit).toHaveProperty("id");
  });


  it("Should not be able to create a new statement transfer if user not exist ", async () => {

    expect(async () => {

      await createTransferStatementUseCase.execute({

        user_id: 'wrong-id-123',
        sender_id: 'wrong-id-123',
        description: "Test Statement Deposit",
        amount: 500,
        type: "transfer" as OperationType,

      });

    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create a new statement transfer if Insufficient funds", async () => {

    expect(async () => {

      const user = await createUserUseCase.execute({
        email: "test_withdraw@email.com",
        name: "Test Withdraw wrong",
        password: "password123"
      });

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      await createTransferStatementUseCase.execute({

        user_id: userCreated?.id as string,
        sender_id: userCreated?.id as string,
        description: "Test Statement withdraw",
        amount: 200,
        type: "transfer" as OperationType,

      });

    }).rejects.toBeInstanceOf(AppError);

  });


});