import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsers1755525601726 implements MigrationInterface {
    name = 'AddUsers1755525601726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_PRODUCTS_CATEGORY"`);
        await queryRunner.query(`CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "maxUsers" integer, "maxDevices" integer, "features" text, CONSTRAINT "UQ_ae18a0f6e0143f06474aa8cef1f" UNIQUE ("name"), CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "suscription_level"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "UQ_a1203c18f7da6c18050442a986a" UNIQUE ("stripeCustomerId")`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "subscription_plan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "userId" character varying`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "createdAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" ADD CONSTRAINT "FK_8a3a1caa7a5ba76f82bce31d4f8" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_104dc663edfae9d2a1161925b1f" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_104dc663edfae9d2a1161925b1f"`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_8a3a1caa7a5ba76f82bce31d4f8"`);
        await queryRunner.query(`ALTER TABLE "contact" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "subscription_plan_id"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "UQ_a1203c18f7da6c18050442a986a"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "suscription_level" character varying`);
        await queryRunner.query(`DROP TABLE "subscription_plans"`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" ADD CONSTRAINT "FK_PRODUCTS_CATEGORY" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
