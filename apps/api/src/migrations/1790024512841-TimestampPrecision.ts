import { MigrationInterface, QueryRunner } from "typeorm";

export class TimestampPrecision1790024512841 implements MigrationInterface {
    name = 'TimestampPrecision1790024512841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screenings" ALTER COLUMN "startsAt" TYPE TIMESTAMP(3) WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screenings" ALTER COLUMN "startsAt" TYPE TIMESTAMP(6) WITH TIME ZONE`);
    }

}
