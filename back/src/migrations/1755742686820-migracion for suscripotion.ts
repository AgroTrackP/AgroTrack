import { MigrationInterface, QueryRunner } from "typeorm";

export class MigracionForSuscripotion1755742686820 implements MigrationInterface {
    name = 'MigracionForSuscripotion1755742686820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD "season" character varying NOT NULL DEFAULT 'verano'`);
        await queryRunner.query(`CREATE TYPE "public"."USERS_subscriptionstatus_enum" AS ENUM('active', 'past_due', 'canceled', 'none')`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "subscriptionStatus" "public"."USERS_subscriptionstatus_enum" NOT NULL DEFAULT 'none'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."USERS_subscriptionstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP COLUMN "season"`);
    }

}
