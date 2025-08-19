import { MigrationInterface, QueryRunner } from "typeorm";

export class NombreDeLaCarpeta1755565146416 implements MigrationInterface {
    name = 'NombreDeLaCarpeta1755565146416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_104dc663edfae9d2a1161925b1f"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "subscription_plan_id"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "UQ_a1203c18f7da6c18050442a986a"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "suscription_level" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "suscription_level"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "UQ_a1203c18f7da6c18050442a986a" UNIQUE ("stripeCustomerId")`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "subscription_plan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_104dc663edfae9d2a1161925b1f" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
