import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecommendationToPlantations1755933195927
  implements MigrationInterface
{
  name = 'AddRecommendationToPlantations1755933195927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" ADD "recommendation_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" ADD CONSTRAINT "FK_e828480d518219dc7c65f79f03b" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" DROP CONSTRAINT "FK_e828480d518219dc7c65f79f03b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" DROP COLUMN "recommendation_id"`,
    );
  }
}
