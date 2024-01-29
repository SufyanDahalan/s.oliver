import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707181080256 implements MigrationInterface {
    name = 'Init1707181080256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "imgUrl" varchar NOT NULL, "brand" varchar NOT NULL, "price" integer NOT NULL, "color" varchar NOT NULL, "size" varchar NOT NULL, "discount" integer NOT NULL, "sustainable" boolean NOT NULL, "new" boolean NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "cart_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "productId" integer, "userUsername" varchar)`);
        await queryRunner.query(`CREATE TABLE "user" ("username" varchar PRIMARY KEY NOT NULL, "passwordHash" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_cart_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "productId" integer, "userUsername" varchar, CONSTRAINT "FK_4f1b0c66f4e0b4610e14ca42e5c" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_35cdcfadd699cc3365f211114f9" FOREIGN KEY ("userUsername") REFERENCES "user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_product"("id", "quantity", "productId", "userUsername") SELECT "id", "quantity", "productId", "userUsername" FROM "cart_product"`);
        await queryRunner.query(`DROP TABLE "cart_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_product" RENAME TO "cart_product"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_product" RENAME TO "temporary_cart_product"`);
        await queryRunner.query(`CREATE TABLE "cart_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "productId" integer, "userUsername" varchar)`);
        await queryRunner.query(`INSERT INTO "cart_product"("id", "quantity", "productId", "userUsername") SELECT "id", "quantity", "productId", "userUsername" FROM "temporary_cart_product"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cart_product"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
