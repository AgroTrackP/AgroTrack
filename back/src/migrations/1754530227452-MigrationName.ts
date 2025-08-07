import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1754530227452 implements MigrationInterface {
  name = 'MigrationName1754530227452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PLANTATIONS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "area_m2" numeric NOT NULL, "crop_type" character varying NOT NULL, "location" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "UQ_25a8ca68c1e5586eb1ef2ea4274" UNIQUE ("name"), CONSTRAINT "PK_99fa0db277cdeba0bbc6700778f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "UQ_95c4bcc8f375a296ecd159f2b05" UNIQUE ("name"), CONSTRAINT "PK_47e07d412b006b8dd0777076b0f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "phenologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "UQ_20830e8246ecdb16130d3b5fdea" UNIQUE ("name"), CONSTRAINT "PK_fc70fa0b7d4655b2793f936d1c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "USERS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'User', "created_at" TIMESTAMP NOT NULL, "suscription_level" character varying, CONSTRAINT "UQ_a1689164dbbcca860ce6d17b2e1" UNIQUE ("email"), CONSTRAINT "PK_b16c39a00c89083529c6166fa5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "DISEASES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "PK_fea592b83760555149ba53e4f7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."APPLICATION_PLANS_status_enum" AS ENUM('pending', 'planned', 'in_progress', 'done', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "APPLICATION_PLANS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planned_date" date NOT NULL, "total_water" numeric NOT NULL, "total_product" numeric NOT NULL, "status" "public"."APPLICATION_PLANS_status_enum" NOT NULL DEFAULT 'pending', "user_id" uuid, "plantation_id" uuid, "disease_id" uuid, CONSTRAINT "PK_0a44a7913b3ee03db5a568895ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_plan_items" ("id" SERIAL NOT NULL, "dosage_per_m2" numeric NOT NULL, "calculated_quantity" numeric NOT NULL, "application_plan_id" uuid, "product_id" uuid, CONSTRAINT "PK_af9015f3a9ef31b14973170b14c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "PRODUCTS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "concentration" numeric NOT NULL, "water_per_liter" numeric NOT NULL, "stock" numeric NOT NULL, "alert_threshold" numeric NOT NULL, "user_id" uuid, CONSTRAINT "PK_2fe88715843405b725ad16c32fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "disease_product" ("disease_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_d8a380fe2a4720ad7b2259439d8" PRIMARY KEY ("disease_id", "product_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9816c3f97ff23a600641b94ada" ON "disease_product" ("disease_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4be9a1831794d57d545922dc5" ON "disease_product" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" ADD CONSTRAINT "FK_76be7acfd2b4f374d2423c868e4" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_types" ADD CONSTRAINT "FK_1aae4a4425c42ca3f1d0a43be84" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "phenologies" ADD CONSTRAINT "FK_7f0177d41325186848444fc77c2" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "DISEASES" ADD CONSTRAINT "FK_56aa783fbaba2c0004a942ddfe1" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_d4552afb1c8ebff782c523ab3fa" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_96ded69fad27d73bf7cd03bb52f" FOREIGN KEY ("plantation_id") REFERENCES "PLANTATIONS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_ec52839bb8c1252e2a93decac70" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_plan_items" ADD CONSTRAINT "FK_7db5a9ae4d7399fbd5343d2e4a2" FOREIGN KEY ("application_plan_id") REFERENCES "APPLICATION_PLANS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_plan_items" ADD CONSTRAINT "FK_e70ed3e247cfb8325cf45159370" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PRODUCTS" ADD CONSTRAINT "FK_91f65d8dd885122a194212339fc" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disease_product" ADD CONSTRAINT "FK_9816c3f97ff23a600641b94ada6" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "disease_product" ADD CONSTRAINT "FK_c4be9a1831794d57d545922dc54" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "disease_product" DROP CONSTRAINT "FK_c4be9a1831794d57d545922dc54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disease_product" DROP CONSTRAINT "FK_9816c3f97ff23a600641b94ada6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_91f65d8dd885122a194212339fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_plan_items" DROP CONSTRAINT "FK_e70ed3e247cfb8325cf45159370"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_plan_items" DROP CONSTRAINT "FK_7db5a9ae4d7399fbd5343d2e4a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_ec52839bb8c1252e2a93decac70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_96ded69fad27d73bf7cd03bb52f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_d4552afb1c8ebff782c523ab3fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "DISEASES" DROP CONSTRAINT "FK_56aa783fbaba2c0004a942ddfe1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "phenologies" DROP CONSTRAINT "FK_7f0177d41325186848444fc77c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application_types" DROP CONSTRAINT "FK_1aae4a4425c42ca3f1d0a43be84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PLANTATIONS" DROP CONSTRAINT "FK_76be7acfd2b4f374d2423c868e4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4be9a1831794d57d545922dc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9816c3f97ff23a600641b94ada"`,
    );
    await queryRunner.query(`DROP TABLE "disease_product"`);
    await queryRunner.query(`DROP TABLE "PRODUCTS"`);
    await queryRunner.query(`DROP TABLE "application_plan_items"`);
    await queryRunner.query(`DROP TABLE "APPLICATION_PLANS"`);
    await queryRunner.query(
      `DROP TYPE "public"."APPLICATION_PLANS_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "DISEASES"`);
    await queryRunner.query(`DROP TABLE "USERS"`);
    await queryRunner.query(`DROP TABLE "phenologies"`);
    await queryRunner.query(`DROP TABLE "application_types"`);
    await queryRunner.query(`DROP TABLE "PLANTATIONS"`);
  }
}
