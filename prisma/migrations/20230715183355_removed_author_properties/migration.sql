/*
  Warnings:

  - You are about to drop the column `createdAt` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `wikipedia` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `default` on the `cathegories` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `cathegories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `cathegories` table. All the data in the column will be lost.
  - Added the required column `summary` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `authors` DROP COLUMN `createdAt`,
    DROP COLUMN `photo`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `wikipedia`,
    MODIFY `biography` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `body`,
    ADD COLUMN `summary` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `cathegories` DROP COLUMN `default`,
    DROP COLUMN `description`,
    DROP COLUMN `icon`;
