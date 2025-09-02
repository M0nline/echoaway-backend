import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAccommodationsStructure1756850031839 implements MigrationInterface {
    name = 'UpdateAccommodationsStructure1756850031839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorites" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "accommodationId" integer NOT NULL, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accommodation_images" ("id" SERIAL NOT NULL, "url" text NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accommodationId" integer NOT NULL, CONSTRAINT "PK_7c517ba83a20a5d61862cadb170" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'host', 'guest', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "avatar" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "pricePerNight"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "numberOfRooms"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "address" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "postalCode" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "city" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "priceMinPerNight" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "priceMaxPerNight" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "numberOfBeds" integer`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "bookingLink" text`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "phoneNumber" text`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "hostId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."accommodations_type_enum" AS ENUM('Appartement', 'Maison', 'Chalet', 'Cabane', 'Tiny house', 'Yourte/Tipi', 'Roulotte', 'Troglodyte', 'Phare/Refuge')`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "type" "public"."accommodations_type_enum" NOT NULL DEFAULT 'Maison'`);
        await queryRunner.query(`ALTER TYPE "public"."accommodations_connectivity_enum" RENAME TO "accommodations_connectivity_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."accommodations_connectivity_enum" AS ENUM('Zone blanche', 'Zone grise', 'Autre')`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" TYPE "public"."accommodations_connectivity_enum" USING "connectivity"::"text"::"public"."accommodations_connectivity_enum"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" SET DEFAULT 'Zone blanche'`);
        await queryRunner.query(`DROP TYPE "public"."accommodations_connectivity_enum_old"`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_e747534006c6e3c2f09939da60f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_a8fa7f3c11a28a60c64ecee8d79" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accommodation_images" ADD CONSTRAINT "FK_fa42084a4772ca7fe0ef98df038" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // Réorganisation des colonnes dans un ordre logique
        await queryRunner.query(`
          CREATE TABLE "accommodations_new" (
            "id" SERIAL NOT NULL,
            
            -- Identification
            "name" character varying(100) NOT NULL,
            "hostId" integer NOT NULL,
            
            -- Localisation
            "address" character varying(200) NOT NULL,
            "postalCode" character varying(10) NOT NULL,
            "city" character varying(100) NOT NULL,
            
            -- Caractéristiques
            "type" "public"."accommodations_type_enum" NOT NULL DEFAULT 'Maison',
            "numberOfBeds" integer,
            "connectivity" "public"."accommodations_connectivity_enum" NOT NULL DEFAULT 'Zone blanche',
            
            -- Tarification
            "priceMinPerNight" numeric(10,2),
            "priceMaxPerNight" numeric(10,2),
            
            -- Contact/Réservation
            "bookingLink" text,
            "phoneNumber" text,
            
            -- Métadonnées
            "description" text,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            
            CONSTRAINT "PK_accommodations" PRIMARY KEY ("id")
          )
        `);

        // Copie des données
        await queryRunner.query(`
          INSERT INTO "accommodations_new" (
            "id", "name", "hostId", 
            "address", "postalCode", "city",
            "type", "numberOfBeds", "connectivity",
            "priceMinPerNight", "priceMaxPerNight",
            "bookingLink", "phoneNumber",
            "description", "createdAt", "updatedAt"
          )
          SELECT 
            "id", "name", "hostId",
            "address", "postalCode", "city",
            "type", "numberOfBeds", "connectivity",
            "priceMinPerNight", "priceMaxPerNight",
            "bookingLink", "phoneNumber",
            "description", "createdAt", "updatedAt"
          FROM "accommodations"
        `);

        // Suppression de l'ancienne table
        await queryRunner.query(`DROP TABLE "accommodations" CASCADE`);

        // Renommage de la nouvelle table
        await queryRunner.query(`ALTER TABLE "accommodations_new" RENAME TO "accommodations"`);

        // Recréation des contraintes de clé étrangère
        await queryRunner.query(`ALTER TABLE "accommodations" ADD CONSTRAINT "FK_2b3059a0da978c4b27fec2580ae" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accommodations" DROP CONSTRAINT "FK_2b3059a0da978c4b27fec2580ae"`);
        await queryRunner.query(`ALTER TABLE "accommodation_images" DROP CONSTRAINT "FK_fa42084a4772ca7fe0ef98df038"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_a8fa7f3c11a28a60c64ecee8d79"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_e747534006c6e3c2f09939da60f"`);
        await queryRunner.query(`CREATE TYPE "public"."accommodations_connectivity_enum_old" AS ENUM('None', 'Low', 'High')`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" TYPE "public"."accommodations_connectivity_enum_old" USING "connectivity"::"text"::"public"."accommodations_connectivity_enum_old"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ALTER COLUMN "connectivity" SET DEFAULT 'None'`);
        await queryRunner.query(`DROP TYPE "public"."accommodations_connectivity_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."accommodations_connectivity_enum_old" RENAME TO "accommodations_connectivity_enum"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."accommodations_type_enum"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "type" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "name" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "hostId"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "bookingLink"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "numberOfBeds"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "priceMaxPerNight"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "priceMinPerNight"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "postalCode"`);
        await queryRunner.query(`ALTER TABLE "accommodations" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "numberOfRooms" integer`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "pricePerNight" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "accommodations" ADD "location" character varying(500) NOT NULL`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "accommodation_images"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
    }

}
