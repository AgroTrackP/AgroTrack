import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUsers1754604749020 implements MigrationInterface {
    name = 'AddIsActiveToUsers1754604749020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "isActive"`);
    }

}
