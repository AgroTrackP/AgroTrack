import { MigrationInterface, QueryRunner } from "typeorm";

export class ConsolidateUserAndSubscriptionSchema1755560268609 implements MigrationInterface {
    name = 'ConsolidateUserAndSubscriptionSchema1755560268609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD "stripePriceId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" ADD CONSTRAINT "UQ_2b15d50c7f5a734bd6af80a27a4" UNIQUE ("stripePriceId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP CONSTRAINT "UQ_2b15d50c7f5a734bd6af80a27a4"`);
        await queryRunner.query(`ALTER TABLE "subscription_plans" DROP COLUMN "stripePriceId"`);
    }

}
