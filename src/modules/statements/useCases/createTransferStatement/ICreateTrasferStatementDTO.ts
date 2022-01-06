import { Statement } from "../../entities/Statement";

export type ICreateTrasferStatementDTO =
  Pick<
    Statement,
    'user_id' |
    'sender_id' |
    'amount' |
    'description' |
    'type'
  >
