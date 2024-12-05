-- DropForeignKey
ALTER TABLE "BannerAds" DROP CONSTRAINT "BannerAds_userId_fkey";

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cheap" INTEGER NOT NULL,
    "luxurious" INTEGER NOT NULL,
    "clean" INTEGER NOT NULL,
    "cozy" INTEGER NOT NULL,
    "goodService" INTEGER NOT NULL,
    "niceView" INTEGER NOT NULL,
    "parking" INTEGER NOT NULL,
    "pool" INTEGER NOT NULL,
    "spa" INTEGER NOT NULL,
    "gym" INTEGER NOT NULL,
    "strategic" INTEGER NOT NULL,
    "delicious" INTEGER NOT NULL,
    "breakfast" INTEGER NOT NULL,
    "safety" INTEGER NOT NULL,
    "family" INTEGER NOT NULL,
    "pet" INTEGER NOT NULL,
    "aesthetic" INTEGER NOT NULL,
    "disability" INTEGER NOT NULL,
    "laundry" INTEGER NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHotelClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHotelClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserHotelBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "bookmarkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHotelBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelDetail" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "HotelDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanDetail" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "PlanDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelPlan" (
    "id" TEXT NOT NULL,
    "hotelDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planDetailId" TEXT NOT NULL,

    CONSTRAINT "HotelPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planDetailId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserHotelClick" ADD CONSTRAINT "UserHotelClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHotelClick" ADD CONSTRAINT "UserHotelClick_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHotelBookmark" ADD CONSTRAINT "UserHotelBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHotelBookmark" ADD CONSTRAINT "UserHotelBookmark_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelDetail" ADD CONSTRAINT "HotelDetail_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanDetail" ADD CONSTRAINT "PlanDetail_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelPlan" ADD CONSTRAINT "HotelPlan_hotelDetailId_fkey" FOREIGN KEY ("hotelDetailId") REFERENCES "HotelDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelPlan" ADD CONSTRAINT "HotelPlan_planDetailId_fkey" FOREIGN KEY ("planDetailId") REFERENCES "PlanDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_planDetailId_fkey" FOREIGN KEY ("planDetailId") REFERENCES "PlanDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerAds" ADD CONSTRAINT "BannerAds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
