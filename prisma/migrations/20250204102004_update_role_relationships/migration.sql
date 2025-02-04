/*
  Warnings:

  - You are about to drop the column `role` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the `_MembershipToRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MembershipToRole" DROP CONSTRAINT "_MembershipToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_MembershipToRole" DROP CONSTRAINT "_MembershipToRole_B_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "role",
ADD COLUMN     "baseRole" "MembershipRole" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "_MembershipToRole";

-- CreateTable
CREATE TABLE "MembershipToRole" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipToRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MembershipToRole_membershipId_idx" ON "MembershipToRole"("membershipId");

-- CreateIndex
CREATE INDEX "MembershipToRole_roleId_idx" ON "MembershipToRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipToRole_membershipId_roleId_key" ON "MembershipToRole"("membershipId", "roleId");

-- AddForeignKey
ALTER TABLE "MembershipToRole" ADD CONSTRAINT "MembershipToRole_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipToRole" ADD CONSTRAINT "MembershipToRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
