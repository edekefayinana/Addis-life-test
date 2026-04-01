/*
  Warnings:

  - Added the required column `clientName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientPhone` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationAmount` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add columns with default values for existing rows
ALTER TABLE "Reservation" ADD COLUMN     "bankSlipUrl" TEXT,
ADD COLUMN     "clientEmail" TEXT,
ADD COLUMN     "clientGovernmentId" TEXT,
ADD COLUMN     "clientName" TEXT NOT NULL DEFAULT 'Unknown Client',
ADD COLUMN     "clientPhone" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "reservationAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Update existing reservations with user data
UPDATE "Reservation" r
SET "clientName" = COALESCE(u.name, 'Unknown Client'),
    "clientPhone" = COALESCE(u.phone, 'N/A'),
    "clientEmail" = u.email
FROM "User" u
WHERE r."userId" = u.id;

-- Remove default values after populating existing rows
ALTER TABLE "Reservation" ALTER COLUMN "clientName" DROP DEFAULT;
ALTER TABLE "Reservation" ALTER COLUMN "clientPhone" DROP DEFAULT;
ALTER TABLE "Reservation" ALTER COLUMN "reservationAmount" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Reservation_clientPhone_idx" ON "Reservation"("clientPhone");

-- CreateIndex
CREATE INDEX "Reservation_clientEmail_idx" ON "Reservation"("clientEmail");
