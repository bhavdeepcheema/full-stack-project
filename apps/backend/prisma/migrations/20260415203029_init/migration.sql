/*
  Warnings:

  - Added the required column `createdAt` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;
