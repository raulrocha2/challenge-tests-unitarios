import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementTransferUseCase } from './CreateStatementTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementTrasferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { sender_id } = request.params;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransferStatement = container.resolve(CreateStatementTransferUseCase);

    const statement = await createTransferStatement.execute({
      user_id: sender_id,
      sender_id: user_id,
      type,
      amount: amount * -1,
      description
    });

    return response.status(201).json(statement);
  }
}
