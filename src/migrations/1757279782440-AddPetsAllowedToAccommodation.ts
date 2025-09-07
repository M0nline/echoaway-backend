import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPetsAllowedToAccommodation1757279782440
  implements MigrationInterface
{
  name = 'AddPetsAllowedToAccommodation1757279782440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accommodations" ADD "petsAllowed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    await queryRunner.query(
      `ALTER TABLE "accommodations" DROP COLUMN "petsAllowed"`,
    );
  }
}
