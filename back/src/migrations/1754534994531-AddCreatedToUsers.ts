import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedToUsers1754534994531 implements MigrationInterface {
    name = 'AddCreatedToUsers1754534994531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "created_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" ALTER COLUMN "created_at" DROP DEFAULT`);
    }

}
