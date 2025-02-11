/*
  Warnings:

  - The primary key for the `event_review` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "event_review" DROP CONSTRAINT "event_review_pkey",
ADD CONSTRAINT "event_review_pkey" PRIMARY KEY ("event_id", "user_id", "transaction_id");
