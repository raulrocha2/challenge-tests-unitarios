import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class balance1640707072826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'balance',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: "statement_id",
                    type: "uuid",
                },
                {
                    name: 'total',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                }
            ],
            foreignKeys: [
                {
                    name: 'fk_user_balance',
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'fk_statements_balance',
                    columnNames: ['statement_id'],
                    referencedTableName: 'statements',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('balances')
    }

}
