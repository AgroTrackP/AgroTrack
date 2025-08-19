import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionStatusAdded1755597273231 implements MigrationInterface {
    name = 'SubscriptionStatusAdded1755597273231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."USERS_subscriptionstatus_enum" AS ENUM('active', 'past_due', 'canceled', 'none')`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "subscriptionStatus" "public"."USERS_subscriptionstatus_enum" NOT NULL DEFAULT 'none'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."USERS_subscriptionstatus_enum"`);
    }

}
