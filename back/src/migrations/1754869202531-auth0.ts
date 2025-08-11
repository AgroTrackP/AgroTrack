import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auth01754869202531 implements MigrationInterface {
  name = 'Auth01754869202531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "auth0Id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD CONSTRAINT "UQ_8093311d04d0e9d2a1a1de2ff4a" UNIQUE ("auth0Id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "USERS" DROP CONSTRAINT "UQ_8093311d04d0e9d2a1a1de2ff4a"`,
    );
    await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "auth0Id"`);
  }
}
