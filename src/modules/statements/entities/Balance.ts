import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "../../users/entities/User";
import { Statement } from "./Statement";
import { v4 as uuid } from 'uuid';


@Entity('balance')
export class Balance {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  statement_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Statement, statement => statement.balance)
  @JoinColumn({ name: 'statement_id' })
  statement: Statement;

  @Column('decimal', { precision: 5, scale: 2 })
  total: number;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
} 