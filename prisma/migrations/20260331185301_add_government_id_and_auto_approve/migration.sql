-- AlterTable
ALTER TABLE "User" ADD COLUMN     "governmentIdUrl" TEXT,
ALTER COLUMN "approvalStatus" SET DEFAULT 'APPROVED';
