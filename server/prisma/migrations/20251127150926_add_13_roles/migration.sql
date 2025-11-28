-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'MOTHER';
ALTER TYPE "Role" ADD VALUE 'WHITELABEL';
ALTER TYPE "Role" ADD VALUE 'SUPERADMIN';
ALTER TYPE "Role" ADD VALUE 'ADMIN';
ALTER TYPE "Role" ADD VALUE 'B2B_SUBADMIN';
ALTER TYPE "Role" ADD VALUE 'SENIOR_AFFILIATE';
ALTER TYPE "Role" ADD VALUE 'AFFILIATE';
ALTER TYPE "Role" ADD VALUE 'SUPER_AGENT';
