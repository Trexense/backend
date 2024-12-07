/*
  Warnings:

  - A unique constraint covering the columns `[hotelId]` on the table `UserHotelBookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId]` on the table `UserHotelClick` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `BannerAds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `BannerAds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `HotelDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BannerAds" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HotelDetail" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserHotelBookmark_hotelId_key" ON "UserHotelBookmark"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHotelClick_hotelId_key" ON "UserHotelClick"("hotelId");
