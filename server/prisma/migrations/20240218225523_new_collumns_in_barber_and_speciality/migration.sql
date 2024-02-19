-- AlterTable
ALTER TABLE "barbers" ADD COLUMN     "photo" TEXT;

-- AlterTable
ALTER TABLE "specialities" ADD COLUMN     "photo" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "time" TEXT NOT NULL DEFAULT '00:00';
