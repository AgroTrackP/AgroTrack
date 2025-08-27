import { MigrationInterface, QueryRunner } from "typeorm";

export class CalendarEntity1756323156685 implements MigrationInterface {
    name = 'CalendarEntity1756323156685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calendar_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "nextActionDate" date NOT NULL, "actionType" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_7d668083b7f3e66b1e64f418f77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calendar_entry" ADD CONSTRAINT "FK_e3e7e4a3777761e69d5c7f6db16" FOREIGN KEY ("userId") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendar_entry" DROP CONSTRAINT "FK_e3e7e4a3777761e69d5c7f6db16"`);
        await queryRunner.query(`DROP TABLE "calendar_entry"`);
    }

}
