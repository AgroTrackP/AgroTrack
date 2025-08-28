import { MigrationInterface, QueryRunner } from "typeorm";

export class Isactivemessage1756334080615 implements MigrationInterface {
    name = 'Isactivemessage1756334080615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "isActive"`);
    }

}
