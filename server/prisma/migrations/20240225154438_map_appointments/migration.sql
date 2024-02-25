/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "hour" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "barberId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barbers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
