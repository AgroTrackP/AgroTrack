import { MigrationInterface, QueryRunner } from "typeorm";

export class Imgurl1755101499007 implements MigrationInterface {
    name = 'Imgurl1755101499007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" ADD "imgUrl" character varying DEFAULT 'https://res.cloudinary.com/dbemhu1mr/image/upload/v1755097246/icon-7797704_640_t4vlks.png'`);
        await queryRunner.query(`ALTER TABLE "USERS" ADD "imgPublicId" character varying DEFAULT 'icon-7797704_640_t4vlks'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "imgPublicId"`);
        await queryRunner.query(`ALTER TABLE "USERS" DROP COLUMN "imgUrl"`);
    }

}
