import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToProducts1754864702856 implements MigrationInterface {
    name = 'AddIsActiveToProducts1754864702856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCTS" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCTS" DROP COLUMN "isActive"`);
    }

}
