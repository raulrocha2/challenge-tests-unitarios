import { Balance } from "../../entities/Balance";

export type ICreateBalanceDTO =
  Pick<
    Balance,
    'user_id' |
    'statement_id' |
    'total'
  >