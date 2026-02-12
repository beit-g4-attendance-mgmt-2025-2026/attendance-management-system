-- AlterTable
ALTER TABLE "User" ALTER COLUMN "resetPasswordExpireAt" DROP DEFAULT,
ALTER COLUMN "resetPasswordExpireAt" SET DATA TYPE TEXT;
