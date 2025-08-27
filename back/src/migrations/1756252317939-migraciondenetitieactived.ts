import { MigrationInterface, QueryRunner } from "typeorm";

export class Migraciondenetitieactived1756252317939 implements MigrationInterface {
    name = 'Migraciondenetitieactived1756252317939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TYPE "public"."activity-logs_type_enum" RENAME TO "activity-logs_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."activity-logs_type_enum" AS ENUM('USER_LOGIN', 'USER_REGISTER', 'USER_IMG_UPDATED', 'USER_INFO_UPDATED', 'USER_DELETED', 'USER_INNACTIVE', 'PLANTATION_CREATED', 'PLANTATION_UPDATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_CANCELED')`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ALTER COLUMN "type" TYPE "public"."activity-logs_type_enum" USING "type"::"text"::"public"."activity-logs_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."activity-logs_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."activity-logs_type_enum_old" AS ENUM('USER_LOGIN', 'USER_REGISTER', 'PLANTATION_CREATED', 'PLANTATION_UPDATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_CANCELED')`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ALTER COLUMN "type" TYPE "public"."activity-logs_type_enum_old" USING "type"::"text"::"public"."activity-logs_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."activity-logs_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."activity-logs_type_enum_old" RENAME TO "activity-logs_type_enum"`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP COLUMN "isActive"`);
    }

}
