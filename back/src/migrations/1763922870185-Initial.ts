import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1763922870185 implements MigrationInterface {
    name = 'Initial1763922870185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application_plan_items" ("id" SERIAL NOT NULL, "dosage_per_m2" numeric NOT NULL, "calculated_quantity" numeric NOT NULL, "application_plan_id" uuid, "product_id" uuid, CONSTRAINT "PK_af9015f3a9ef31b14973170b14c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CATEGORIES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "UQ_47c74bcf8ffb7df9a1525c23420" UNIQUE ("name"), CONSTRAINT "PK_fdcef262c7ee3ae985f62b3695f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PRODUCTS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "concentration" numeric NOT NULL, "water_per_liter" numeric NOT NULL, "stock" numeric NOT NULL, "alert_threshold" numeric NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "user_id" uuid, "category_id" uuid, CONSTRAINT "PK_2fe88715843405b725ad16c32fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "DISEASES" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "PK_fea592b83760555149ba53e4f7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."APPLICATION_PLANS_status_enum" AS ENUM('pending', 'planned', 'in_progress', 'done', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "APPLICATION_PLANS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planned_date" date NOT NULL, "total_water" numeric NOT NULL, "total_product" numeric NOT NULL, "status" "public"."APPLICATION_PLANS_status_enum" NOT NULL DEFAULT 'pending', "user_id" uuid, "plantation_id" uuid, "disease_id" uuid, CONSTRAINT "PK_0a44a7913b3ee03db5a568895ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PLANTATIONS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "area_m2" numeric NOT NULL, "crop_type" character varying NOT NULL, "location" character varying NOT NULL, "start_date" TIMESTAMP NOT NULL, "season" character varying NOT NULL DEFAULT 'verano', "isActive" boolean NOT NULL DEFAULT true, "user_id" uuid, CONSTRAINT "UQ_25a8ca68c1e5586eb1ef2ea4274" UNIQUE ("name"), CONSTRAINT "PK_99fa0db277cdeba0bbc6700778f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "UQ_95c4bcc8f375a296ecd159f2b05" UNIQUE ("name"), CONSTRAINT "PK_47e07d412b006b8dd0777076b0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "phenologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text NOT NULL, "user_id" uuid, CONSTRAINT "UQ_20830e8246ecdb16130d3b5fdea" UNIQUE ("name"), CONSTRAINT "PK_fc70fa0b7d4655b2793f936d1c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "maxUsers" integer, "maxDevices" integer, "features" text, "stripePriceId" character varying NOT NULL, CONSTRAINT "UQ_ae18a0f6e0143f06474aa8cef1f" UNIQUE ("name"), CONSTRAINT "UQ_2b15d50c7f5a734bd6af80a27a4" UNIQUE ("stripePriceId"), CONSTRAINT "PK_9ab8fe6918451ab3d0a4fb6bb0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activity-logs_type_enum" AS ENUM('USER_LOGIN', 'USER_REGISTER', 'USER_IMG_UPDATED', 'USER_INFO_UPDATED', 'USER_DELETED', 'USER_INNACTIVE', 'PLANTATION_CREATED', 'PLANTATION_UPDATED', 'SUBSCRIPTION_STARTED', 'SUBSCRIPTION_CANCELED')`);
        await queryRunner.query(`CREATE TABLE "activity-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."activity-logs_type_enum" NOT NULL, "description" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "user-id" uuid, CONSTRAINT "PK_07eaeb64a9e3b336b4b8a522d97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "calendar_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "nextActionDate" date NOT NULL, "actionType" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_7d668083b7f3e66b1e64f418f77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."USERS_subscriptionstatus_enum" AS ENUM('active', 'past_due', 'canceled', 'none')`);
        await queryRunner.query(`CREATE TABLE "USERS" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'User', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "isConfirmed" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "auth0Id" character varying, "imgUrl" character varying DEFAULT 'https://res.cloudinary.com/dbemhu1mr/image/upload/v1755097246/icon-7797704_640_t4vlks.png', "imgPublicId" character varying DEFAULT 'icon-7797704_640_t4vlks', "stripeCustomerId" character varying, "subscriptionStatus" "public"."USERS_subscriptionstatus_enum" NOT NULL DEFAULT 'none', "subscription_plan_id" uuid, CONSTRAINT "UQ_a1689164dbbcca860ce6d17b2e1" UNIQUE ("email"), CONSTRAINT "UQ_8093311d04d0e9d2a1a1de2ff4a" UNIQUE ("auth0Id"), CONSTRAINT "UQ_a1203c18f7da6c18050442a986a" UNIQUE ("stripeCustomerId"), CONSTRAINT "PK_b16c39a00c89083529c6166fa5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recommendations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "crop_type" character varying(100) NOT NULL, "planting_notes" text, "recommended_water_per_m2" numeric, "recommended_fertilizer" text, "additional_notes" text, "recommended_application_type_id" uuid, CONSTRAINT "PK_23a8d2db26db8cabb6ae9d6cd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying, "title" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "disease_product" ("disease_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_d8a380fe2a4720ad7b2259439d8" PRIMARY KEY ("disease_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9816c3f97ff23a600641b94ada" ON "disease_product" ("disease_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c4be9a1831794d57d545922dc5" ON "disease_product" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "recommendation_diseases" ("recommendation_id" uuid NOT NULL, "disease_id" uuid NOT NULL, CONSTRAINT "PK_b84c28404ac06d9af4e3d9abf43" PRIMARY KEY ("recommendation_id", "disease_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_159759bd9163c9961753634d57" ON "recommendation_diseases" ("recommendation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_10af0356f5eafa88feba9c8677" ON "recommendation_diseases" ("disease_id") `);
        await queryRunner.query(`CREATE TABLE "recommendation_products" ("recommendation_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_f662971f98e573dba95fe8d686e" PRIMARY KEY ("recommendation_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4fcab3c082e2f9aebd9d0b6032" ON "recommendation_products" ("recommendation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5119e69e51a94537cbf11a88a2" ON "recommendation_products" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "application_plan_items" ADD CONSTRAINT "FK_7db5a9ae4d7399fbd5343d2e4a2" FOREIGN KEY ("application_plan_id") REFERENCES "APPLICATION_PLANS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_plan_items" ADD CONSTRAINT "FK_e70ed3e247cfb8325cf45159370" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" ADD CONSTRAINT "FK_91f65d8dd885122a194212339fc" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" ADD CONSTRAINT "FK_8a3a1caa7a5ba76f82bce31d4f8" FOREIGN KEY ("category_id") REFERENCES "CATEGORIES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DISEASES" ADD CONSTRAINT "FK_56aa783fbaba2c0004a942ddfe1" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_d4552afb1c8ebff782c523ab3fa" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_96ded69fad27d73bf7cd03bb52f" FOREIGN KEY ("plantation_id") REFERENCES "PLANTATIONS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" ADD CONSTRAINT "FK_ec52839bb8c1252e2a93decac70" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" ADD CONSTRAINT "FK_76be7acfd2b4f374d2423c868e4" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "application_types" ADD CONSTRAINT "FK_1aae4a4425c42ca3f1d0a43be84" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "phenologies" ADD CONSTRAINT "FK_7f0177d41325186848444fc77c2" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity-logs" ADD CONSTRAINT "FK_694ea3e7d4335df3b1d011703f0" FOREIGN KEY ("user-id") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calendar_entry" ADD CONSTRAINT "FK_e3e7e4a3777761e69d5c7f6db16" FOREIGN KEY ("userId") REFERENCES "USERS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD CONSTRAINT "FK_104dc663edfae9d2a1161925b1f" FOREIGN KEY ("subscription_plan_id") REFERENCES "subscription_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recommendations" ADD CONSTRAINT "FK_9de647a909b900566a497d27e3f" FOREIGN KEY ("recommended_application_type_id") REFERENCES "application_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "disease_product" ADD CONSTRAINT "FK_9816c3f97ff23a600641b94ada6" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "disease_product" ADD CONSTRAINT "FK_c4be9a1831794d57d545922dc54" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recommendation_diseases" ADD CONSTRAINT "FK_159759bd9163c9961753634d575" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recommendation_diseases" ADD CONSTRAINT "FK_10af0356f5eafa88feba9c8677d" FOREIGN KEY ("disease_id") REFERENCES "DISEASES"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recommendation_products" ADD CONSTRAINT "FK_4fcab3c082e2f9aebd9d0b6032c" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recommendation_products" ADD CONSTRAINT "FK_5119e69e51a94537cbf11a88a2d" FOREIGN KEY ("product_id") REFERENCES "PRODUCTS"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recommendation_products" DROP CONSTRAINT "FK_5119e69e51a94537cbf11a88a2d"`);
        await queryRunner.query(`ALTER TABLE "recommendation_products" DROP CONSTRAINT "FK_4fcab3c082e2f9aebd9d0b6032c"`);
        await queryRunner.query(`ALTER TABLE "recommendation_diseases" DROP CONSTRAINT "FK_10af0356f5eafa88feba9c8677d"`);
        await queryRunner.query(`ALTER TABLE "recommendation_diseases" DROP CONSTRAINT "FK_159759bd9163c9961753634d575"`);
        await queryRunner.query(`ALTER TABLE "disease_product" DROP CONSTRAINT "FK_c4be9a1831794d57d545922dc54"`);
        await queryRunner.query(`ALTER TABLE "disease_product" DROP CONSTRAINT "FK_9816c3f97ff23a600641b94ada6"`);
        await queryRunner.query(`ALTER TABLE "recommendations" DROP CONSTRAINT "FK_9de647a909b900566a497d27e3f"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP CONSTRAINT "FK_104dc663edfae9d2a1161925b1f"`);
        await queryRunner.query(`ALTER TABLE "calendar_entry" DROP CONSTRAINT "FK_e3e7e4a3777761e69d5c7f6db16"`);
        await queryRunner.query(`ALTER TABLE "activity-logs" DROP CONSTRAINT "FK_694ea3e7d4335df3b1d011703f0"`);
        await queryRunner.query(`ALTER TABLE "phenologies" DROP CONSTRAINT "FK_7f0177d41325186848444fc77c2"`);
        await queryRunner.query(`ALTER TABLE "application_types" DROP CONSTRAINT "FK_1aae4a4425c42ca3f1d0a43be84"`);
        await queryRunner.query(`ALTER TABLE "PLANTATIONS" DROP CONSTRAINT "FK_76be7acfd2b4f374d2423c868e4"`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_ec52839bb8c1252e2a93decac70"`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_96ded69fad27d73bf7cd03bb52f"`);
        await queryRunner.query(`ALTER TABLE "APPLICATION_PLANS" DROP CONSTRAINT "FK_d4552afb1c8ebff782c523ab3fa"`);
        await queryRunner.query(`ALTER TABLE "DISEASES" DROP CONSTRAINT "FK_56aa783fbaba2c0004a942ddfe1"`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_8a3a1caa7a5ba76f82bce31d4f8"`);
        await queryRunner.query(`ALTER TABLE "PRODUCTS" DROP CONSTRAINT "FK_91f65d8dd885122a194212339fc"`);
        await queryRunner.query(`ALTER TABLE "application_plan_items" DROP CONSTRAINT "FK_e70ed3e247cfb8325cf45159370"`);
        await queryRunner.query(`ALTER TABLE "application_plan_items" DROP CONSTRAINT "FK_7db5a9ae4d7399fbd5343d2e4a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5119e69e51a94537cbf11a88a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fcab3c082e2f9aebd9d0b6032"`);
        await queryRunner.query(`DROP TABLE "recommendation_products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10af0356f5eafa88feba9c8677"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_159759bd9163c9961753634d57"`);
        await queryRunner.query(`DROP TABLE "recommendation_diseases"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4be9a1831794d57d545922dc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9816c3f97ff23a600641b94ada"`);
        await queryRunner.query(`DROP TABLE "disease_product"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "recommendations"`);
        await queryRunner.query(`DROP TABLE "USERS"`);
        await queryRunner.query(`DROP TYPE "public"."USERS_subscriptionstatus_enum"`);
        await queryRunner.query(`DROP TABLE "calendar_entry"`);
        await queryRunner.query(`DROP TABLE "activity-logs"`);
        await queryRunner.query(`DROP TYPE "public"."activity-logs_type_enum"`);
        await queryRunner.query(`DROP TABLE "subscription_plans"`);
        await queryRunner.query(`DROP TABLE "phenologies"`);
        await queryRunner.query(`DROP TABLE "application_types"`);
        await queryRunner.query(`DROP TABLE "PLANTATIONS"`);
        await queryRunner.query(`DROP TABLE "APPLICATION_PLANS"`);
        await queryRunner.query(`DROP TYPE "public"."APPLICATION_PLANS_status_enum"`);
        await queryRunner.query(`DROP TABLE "DISEASES"`);
        await queryRunner.query(`DROP TABLE "PRODUCTS"`);
        await queryRunner.query(`DROP TABLE "CATEGORIES"`);
        await queryRunner.query(`DROP TABLE "application_plan_items"`);
    }

}
