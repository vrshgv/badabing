import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScreeningsAndAttendances1788468000488 implements MigrationInterface {
    name = 'AddScreeningsAndAttendances1788468000488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "screenings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" character varying(600) NOT NULL, "capacity" integer NOT NULL, "posterUrl" character varying(255), "location" character varying(255) NOT NULL, "year" integer, "runtimeMinutes" integer, "host_id" uuid NOT NULL, "cancelledAt" TIMESTAMP WITH TIME ZONE, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_343138765d7d5a69f71b2ff7795" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7c928d00eb439ce4c0923105e3" ON "screenings"  ("startsAt") `);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "screening_id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" character varying(20) NOT NULL, "position" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_73ad94e686bb6fce7569d38c057" UNIQUE ("screening_id", "user_id"), CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a889dfacc6e897289229da3f8e" ON "attendances"  ("screening_id", "status") `);
        await queryRunner.query(`ALTER TABLE "screenings" ADD CONSTRAINT "FK_b857695f55c18b46d63019e50ce" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_cdbb622f02fea36e647007a73f8" FOREIGN KEY ("screening_id") REFERENCES "screenings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_aa902e05aeb5fde7c1dd4ced2b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_aa902e05aeb5fde7c1dd4ced2b7"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_cdbb622f02fea36e647007a73f8"`);
        await queryRunner.query(`ALTER TABLE "screenings" DROP CONSTRAINT "FK_b857695f55c18b46d63019e50ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a889dfacc6e897289229da3f8e"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c928d00eb439ce4c0923105e3"`);
        await queryRunner.query(`DROP TABLE "screenings"`);
    }

}
