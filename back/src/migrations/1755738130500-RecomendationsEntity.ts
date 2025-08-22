import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecomendationsEntity1755738130500 implements MigrationInterface {
  name = 'RecomendationsEntity1755738130500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recommendations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crop_type" character varying(100) NOT NULL, "planting_notes" text, "recommended_water_per_m2" numeric, "recommended_fertilizer" text, "additional_notes" text, "recommended_application_type_id" uuid, CONSTRAINT "PK_23a8d2db26db8cabb6ae9d6cd87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recommendation_diseases" ("recommendation_id" uuid NOT NULL, "disease_id" uuid NOT NULL, CONSTRAINT "PK_b84c28404ac06d9af4e3d9abf43" PRIMARY KEY ("recommendation_id", "disease_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_159759bd9163c9961753634d57" ON "recommendation_diseases" ("recommendation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10af0356f5eafa88feba9c8677" ON "recommendation_diseases" ("disease_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "recommendation_products" ("recommendation_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_f662971f98e573dba95fe8d686e" PRIMARY KEY ("recommendation_id", "product_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4fcab3c082e2f9aebd9d0b6032" ON "recommendation_products" ("recommendation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5119e69e51a94537cbf11a88a2" ON "recommendation_products" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "USERS" DROP COLUMN "subscriptionStatus"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."USERS_subscriptionstatus_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP COLUMN "season"`);
    await queryRunner.query(
      `ALTER TABLE "recommendations" ADD CONSTRAINT "FK_9de647a909b900566a497d27e3f" FOREIGN KEY ("recommended_application_type_id") REFERENCES "application_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_diseases" ADD CONSTRAINT "FK_159759bd9163c9961753634d575" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_diseases" ADD CONSTRAINT "FK_10af0356f5eafa88feba9c8677d" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_products" ADD CONSTRAINT "FK_4fcab3c082e2f9aebd9d0b6032c" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_products" ADD CONSTRAINT "FK_5119e69e51a94537cbf11a88a2d" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "recommendation_products" DROP CONSTRAINT "FK_5119e69e51a94537cbf11a88a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_products" DROP CONSTRAINT "FK_4fcab3c082e2f9aebd9d0b6032c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_diseases" DROP CONSTRAINT "FK_10af0356f5eafa88feba9c8677d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendation_diseases" DROP CONSTRAINT "FK_159759bd9163c9961753634d575"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recommendations" DROP CONSTRAINT "FK_9de647a909b900566a497d27e3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" ADD "season" character varying NOT NULL DEFAULT 'verano'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."USERS_subscriptionstatus_enum" AS ENUM('active', 'past_due', 'canceled', 'none')`,
    );
    await queryRunner.query(
      `ALTER TABLE "USERS" ADD "subscriptionStatus" "public"."USERS_subscriptionstatus_enum" NOT NULL DEFAULT 'none'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5119e69e51a94537cbf11a88a2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4fcab3c082e2f9aebd9d0b6032"`,
    );
    await queryRunner.query(`DROP TABLE "recommendation_products"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10af0356f5eafa88feba9c8677"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_159759bd9163c9961753634d57"`,
    );
    await queryRunner.query(`DROP TABLE "recommendation_diseases"`);
    await queryRunner.query(`DROP TABLE "recommendations"`);
  }
}
