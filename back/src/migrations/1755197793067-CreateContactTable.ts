import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactTable1755197793067 implements MigrationInterface {
  name = 'CreateContactTable1755197793067';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contact" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "title" varchar(100) NOT NULL,
        "email" varchar(150) NOT NULL,
        "description" text NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact"`);
  }
}
