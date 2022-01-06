import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';
import { CreateTransferStatementUseCase } from './CreateTransferStatementUseCase';




export class CreateTransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransferStatement = container.resolve(CreateTransferStatementUseCase);

    const statement = await createTransferStatement.execute({
      sender_id,
      user_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
