import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionSeason1755717086809 implements MigrationInterface {
    name = 'MigracionSeason1755717086809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD "season" character varying NOT NULL DEFAULT 'verano'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP COLUMN "season"`);
    }

}
