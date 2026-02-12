/*
  Warnings:

  - The `resetPasswordExpireAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordExpireAt",
ADD COLUMN     "resetPasswordExpireAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
