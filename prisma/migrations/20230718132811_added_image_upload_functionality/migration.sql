-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `books_formatId_fkey`;

-- AlterTable
ALTER TABLE `books` MODIFY `formatId` INTEGER NULL;

-- CreateTable
CREATE TABLE `covers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `booksId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cover` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_formatId_fkey` FOREIGN KEY (`formatId`) REFERENCES `formats`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `covers` ADD CONSTRAINT `covers_booksId_fkey` FOREIGN KEY (`booksId`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
