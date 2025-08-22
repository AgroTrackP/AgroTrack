import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityLogEntity1755890033632 implements MigrationInterface {
    name = 'ActivityLogEntity1755890033632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."activity-logs_type_enum" AS ENUM('USER_LOGIN', 'USER_REGISTER', 'PLANTATION_CREATED', 'PLANTATION_UPDATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_CANCELED')`);
        await queryRunner.query(`CREATE TABLE "activity-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."activity-logs_type_enum" NOT NULL, "description" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "user-id" uuid, CONSTRAINT "PK_07eaeb64a9e3b336b4b8a522d97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ADD CONSTRAINT "FK_694ea3e7d4335df3b1d011703f0" FOREIGN KEY ("user-id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity-logs" DROP CONSTRAINT "FK_694ea3e7d4335df3b1d011703f0"`);
        await queryRunner.query(`DROP TABLE "activity-logs"`);
        await queryRunner.query(`DROP TYPE "public"."activity-logs_type_enum"`);
    }

}
