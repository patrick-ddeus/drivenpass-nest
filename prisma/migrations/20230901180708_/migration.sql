/*
  Warnings:

  - Changed the type of `password` on the `credentials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "password",
ADD COLUMN     "password" BYTEA NOT NULL;
