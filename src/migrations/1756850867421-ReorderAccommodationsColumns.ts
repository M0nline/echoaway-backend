import { MigrationInterface, QueryRunner } from "typeorm";

export class ReorderAccommodationsColumns1756850867421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Création de la nouvelle table avec l'ordre souhaité
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
                
                CONSTRAINT "PK_accommodations_new" PRIMARY KEY ("id")
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

        // Suppression des contraintes de clé étrangère
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_a8fa7f3c11a28a60c64ecee8d79"`);
        await queryRunner.query(`ALTER TABLE "accommodation_images" DROP CONSTRAINT "FK_fa42084a4772ca7fe0ef98df038"`);

        // Suppression de l'ancienne table
        await queryRunner.query(`DROP TABLE "accommodations"`);

        // Renommage de la nouvelle table
        await queryRunner.query(`ALTER TABLE "accommodations_new" RENAME TO "accommodations"`);
        await queryRunner.query(`ALTER TABLE "accommodations" RENAME CONSTRAINT "PK_accommodations_new" TO "PK_accommodations"`);

        // Recréation des contraintes de clé étrangère
        await queryRunner.query(`
            ALTER TABLE "favorites" 
            ADD CONSTRAINT "FK_a8fa7f3c11a28a60c64ecee8d79" 
            FOREIGN KEY ("accommodationId") 
            REFERENCES "accommodations"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "accommodation_images" 
            ADD CONSTRAINT "FK_fa42084a4772ca7fe0ef98df038" 
            FOREIGN KEY ("accommodationId") 
            REFERENCES "accommodations"("id") 
            ON DELETE NO ACTION 
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Dans le down, on ne change pas l'ordre des colonnes
        // On restaure simplement la table si nécessaire
        await queryRunner.query(`SELECT 1`);
    }

}
