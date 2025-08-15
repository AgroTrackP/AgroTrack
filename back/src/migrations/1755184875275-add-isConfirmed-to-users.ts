import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsConfirmedOnlyToUsers1755184875275
  implements MigrationInterface
{
  name = 'AddIsConfirmedOnlyToUsers1755184875275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "isConfirmed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "isConfirmed"`);
  }
}
