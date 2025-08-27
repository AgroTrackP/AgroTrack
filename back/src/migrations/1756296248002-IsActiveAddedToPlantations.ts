import { MigrationInterface, QueryRunner } from "typeorm";

export class IsActiveAddedToPlantations1756296248002 implements MigrationInterface {
    name = 'IsActiveAddedToPlantations1756296248002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP CONSTRAINT "FK_e828480d518219dc7c65f79f03b"`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP COLUMN "recommendation_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD "recommendation_id" uuid`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD CONSTRAINT "FK_e828480d518219dc7c65f79f03b" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
