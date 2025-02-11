/*
  Warnings:

  - You are about to drop the column `organizer_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `reference_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `organizers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reference_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_id` to the `event_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applied_reference_code` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `reference_code` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('customer', 'organizer');

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizer_id_fkey";

-- DropIndex
DROP INDEX "users_reference_number_key";

-- AlterTable
ALTER TABLE "event_review" ADD COLUMN     "transaction_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "organizer_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "reference_number",
ADD COLUMN     "applied_reference_code" TEXT NOT NULL,
ADD COLUMN     "reference_code" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;

-- DropTable
DROP TABLE "organizers";

-- CreateIndex
CREATE UNIQUE INDEX "users_reference_code_key" ON "users"("reference_code");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_review" ADD CONSTRAINT "event_review_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;
