/*
  Warnings:

  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "activityLvl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "injuries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "targetWeightKg" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
