import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesOnly1755215919854 implements MigrationInterface {
  name = 'CreateCategoriesOnly1755215919854';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla CATEGORIES
    await queryRunner.query(`
            CREATE TABLE "CATEGORIES" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(50) NOT NULL,
                CONSTRAINT "UQ_CATEGORIES_NAME" UNIQUE ("name"),
                CONSTRAINT "PK_CATEGORIES_ID" PRIMARY KEY ("id")
            )
        `);

    // Agregar columna category_id a PRODUCTS
    await queryRunner.query(`
            ALTER TABLE "PRODUCTS" ADD "category_id" uuid
        `);

    // Agregar relación FK entre PRODUCTS y CATEGORIES
    await queryRunner.query(`
            ALTER TABLE "PRODUCTS"
            ADD CONSTRAINT "FK_PRODUCTS_CATEGORY"
            FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar FK y columna de PRODUCTS
    await queryRunner.query(`
            ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_PRODUCTS_CATEGORY"
        `);
    await queryRunner.query(`
            ALTER TABLE "PRODUCTS" DROP COLUMN "category_id"
        `);

    // Eliminar tabla CATEGORIES
    await queryRunner.query(`
            DROP TABLE "CATEGORIES"
        `);
  }
}
