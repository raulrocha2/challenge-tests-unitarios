import { getRepository, Repository } from "typeorm";
import { Balance } from "../entities/Balance";
import { ICreateBalanceDTO } from "../useCases/createaBalance/ICreateBalanceDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IBalanceRepository } from "./IBalanceRepository";



export class BalanceRepository implements IBalanceRepository {

  private repository: Repository<Balance>;

  constructor() {
    this.repository = getRepository(Balance);
  }
  async create({
    user_id,
    statement_id,
    total
  }: ICreateBalanceDTO): Promise<Balance> {

    const balance = this.repository.create({
      user_id,
      statement_id,
      total
    });

    return this.repository.save(balance);
  }

  async getBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<{ balance: number; }> {
    const userBalance = await this.repository.find({
      where: { user_id }
    });

    const balance = userBalance.total
    return balance;
  };


}