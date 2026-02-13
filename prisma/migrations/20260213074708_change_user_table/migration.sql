/*
  Warnings:

  - The values [JAN,FEB,MAR,APR,JUN,JUL,AUG,SEP,OCT,NOV,DEC] on the enum `Month` will be removed. If these variants are still used in the database, this will fail.
  - The values [SEM_1,SEM_2] on the enum `Semester` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `students` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `teachers` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Department` table. All the data in the column will be lost.
  - The `monthlySubAttendanceId` column on the `MonthlyClassAttendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dailyAttendanceId` on the `MonthlySubAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,subjectId,day,month]` on the table `DailyAttendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rollNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `day` on the `DailyAttendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `classId` to the `MonthlyClassAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyClassAttendanceId` to the `MonthlySubAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `MonthlySubAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `MonthlySubAttendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `times` to the `MonthlySubAttendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `departmentId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `resetPasswordExpireAt` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Month_new" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');
ALTER TABLE "DailyAttendance" ALTER COLUMN "month" TYPE "Month_new" USING ("month"::text::"Month_new");
ALTER TYPE "Month" RENAME TO "Month_old";
ALTER TYPE "Month_new" RENAME TO "Month";
DROP TYPE "public"."Month_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Semester_new" AS ENUM ('first_semester', 'second_semester');
ALTER TABLE "Class" ALTER COLUMN "semester" TYPE "Semester_new" USING ("semester"::text::"Semester_new");
ALTER TABLE "Student" ALTER COLUMN "semester" TYPE "Semester_new" USING ("semester"::text::"Semester_new");
ALTER TYPE "Semester" RENAME TO "Semester_old";
ALTER TYPE "Semester_new" RENAME TO "Semester";
DROP TYPE "public"."Semester_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Year" ADD VALUE 'FIFTH';
ALTER TYPE "Year" ADD VALUE 'FINAL';

-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_academicYearId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyClassAttendance" DROP CONSTRAINT "MonthlyClassAttendance_monthlySubAttendanceId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlySubAttendance" DROP CONSTRAINT "MonthlySubAttendance_dailyAttendanceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_classId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departmentId_fkey";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "academicYearId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DailyAttendance" DROP COLUMN "day",
ADD COLUMN     "day" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "students",
DROP COLUMN "teachers",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MonthlyClassAttendance" ADD COLUMN     "classId" TEXT NOT NULL,
DROP COLUMN "monthlySubAttendanceId",
ADD COLUMN     "monthlySubAttendanceId" UUID[];

-- AlterTable
ALTER TABLE "MonthlySubAttendance" DROP COLUMN "dailyAttendanceId",
ADD COLUMN     "monthlyClassAttendanceId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "subjectId" TEXT NOT NULL,
ADD COLUMN     "times" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "classId",
ALTER COLUMN "departmentId" SET NOT NULL,
DROP COLUMN "resetPasswordExpireAt",
ADD COLUMN     "resetPasswordExpireAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Day";

-- CreateIndex
CREATE UNIQUE INDEX "Class_userId_key" ON "Class"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAttendance_studentId_subjectId_day_month_key" ON "DailyAttendance"("studentId", "subjectId", "day", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySubAttendance" ADD CONSTRAINT "MonthlySubAttendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySubAttendance" ADD CONSTRAINT "MonthlySubAttendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySubAttendance" ADD CONSTRAINT "MonthlySubAttendance_monthlyClassAttendanceId_fkey" FOREIGN KEY ("monthlyClassAttendanceId") REFERENCES "MonthlyClassAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyClassAttendance" ADD CONSTRAINT "MonthlyClassAttendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
