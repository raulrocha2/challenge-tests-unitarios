import { Balance } from "../entities/Balance";
import { ICreateBalanceDTO } from "../useCases/createaBalance/ICreateBalanceDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";

export interface IBalanceRepository {
  create: (data: ICreateBalanceDTO) => Promise<Balance>;
  getBalance: (data: IGetBalanceDTO) => Promise<{ balance: number }>;
}