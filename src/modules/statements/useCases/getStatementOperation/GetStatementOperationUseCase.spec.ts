import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });


  it("Should be able to get a statement operation ", async () => {

    const user = await createUserUseCase.execute({
      email: "statement.operation.true@email.com",
      name: "Test Name Statement Operation",
      password: "password123"
    });

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const statementCreated = await createStatementUseCase.execute({

      user_id: userCreated?.id as string,
      description: "Test Statement Operation",
      amount: 500,
      type: "deposit" as OperationType,

    });

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: userCreated?.id as string,
      statement_id: statementCreated?.id as string
    });

    expect(getStatement.type).toBe("deposit");
  });

  it("Should not be able to get a statement operation if user not exist ", async () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "statement.operation.false.user@email.com",
        name: "Test Name Statement Operation",
        password: "password123"
      });

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      const statementCreated = await createStatementUseCase.execute({

        user_id: userCreated?.id as string,
        description: "Test Statement Operation",
        amount: 500,
        type: "deposit" as OperationType,

      });

      await getStatementOperationUseCase.execute({
        user_id: 'wrong-id-123',
        statement_id: statementCreated?.id as string
      });

    }).rejects.toBeInstanceOf(AppError);

  });

  it("Should not be able to get a statement operation if statement not exist ", async () => {

    expect(async () => {

      const user = await createUserUseCase.execute({
        email: "statement.operation.false.user@email.com",
        name: "Test Name Statement Operation",
        password: "password123"
      });

      const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

      await getStatementOperationUseCase.execute({
        user_id: userCreated?.id as string,
        statement_id: 'wrong-id-123'
      });

    }).rejects.toBeInstanceOf(AppError);
  });

});