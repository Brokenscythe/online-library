/*
  Warnings:

  - You are about to drop the column `ISBN` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `letterId` on the `books` table. All the data in the column will be lost.
  - You are about to drop the `cathegories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `letters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `book_categories` DROP FOREIGN KEY `book_categories_cathegorieId_fkey`;

-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_letterId_fkey`;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `ISBN`,
    DROP COLUMN `letterId`;

-- DropTable
DROP TABLE `cathegories`;

-- DropTable
DROP TABLE `letters`;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `book_categories` ADD CONSTRAINT `book_categories_cathegorieId_fkey` FOREIGN KEY (`cathegorieId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
