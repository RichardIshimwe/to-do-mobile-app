import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTodosTable1703447513344 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'todos',
              columns: [
                {
                  name: 'id',
                  type: 'integer',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'text',
                  type: 'text',
                },
                {
                  name: 'is_toggled',
                  type: 'boolean',
                },
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
