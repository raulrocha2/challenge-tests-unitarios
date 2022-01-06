import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTrasferStatementDTO } from "../useCases/createTransferStatement/ICreateTrasferStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";

export interface IStatementsRepository {
  create: (data: ICreateStatementDTO) => Promise<Statement>;
  createTrasfer: (data: ICreateTrasferStatementDTO) => Promise<Statement>;
  findStatementOperation: (data: IGetStatementOperationDTO) => Promise<Statement | undefined>;
  getUserBalance: (data: IGetBalanceDTO) => Promise<
    { balance: number } | { balance: number, statement: Statement[] }
  >;
}
