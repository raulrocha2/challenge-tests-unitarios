import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateTrasferStatementDTO } from "./ICreateTrasferStatementDTO";




@injectable()
export class CreateTransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({
    user_id,
    sender_id,
    type,
    amount,
    description }: ICreateTrasferStatementDTO) {


    const senderUser = await this.usersRepository.findById(sender_id);

    if (!senderUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const receiveUser = await this.usersRepository.findById(user_id);

    if (!receiveUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }


    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.WITHDRAW,
      user_id: senderUser.id as string
    });

    const statementOperation = await this.statementsRepository.createTrasfer({
      amount,
      description,
      type,
      user_id: receiveUser.id as string,
      sender_id: senderUser.id as string
    });

    return statementOperation;
  }
}
