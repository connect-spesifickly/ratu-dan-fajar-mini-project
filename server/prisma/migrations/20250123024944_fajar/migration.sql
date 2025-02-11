-- CreateEnum
CREATE TYPE "Status" AS ENUM ('waiting_payment', 'waiting_organizer_confirmation', 'done', 'rejected', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('satu', 'dua', 'tiga', 'empat', 'lima');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "photo" BYTEA,
    "reference_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "kupon_users" (
    "user_id" INTEGER NOT NULL,
    "kupon_id" SERIAL NOT NULL,
    "kupon_value" INTEGER NOT NULL DEFAULT 10000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kupon_users_pkey" PRIMARY KEY ("kupon_id")
);

-- CreateTable
CREATE TABLE "poin_users" (
    "user_id" INTEGER NOT NULL,
    "poin_id" SERIAL NOT NULL,
    "poin_value" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poin_users_pkey" PRIMARY KEY ("poin_id")
);

-- CreateTable
CREATE TABLE "organizers" (
    "organizer_id" SERIAL NOT NULL,
    "organizer_name" VARCHAR(50) NOT NULL,
    "organizer_password" VARCHAR(60) NOT NULL,
    "organizer_photo" BYTEA,
    "organizer_phone_number" VARCHAR(14) NOT NULL,
    "organizer_rek_number" VARCHAR(16) NOT NULL,
    "organizer_bank" VARCHAR(40) NOT NULL,

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("organizer_id")
);

-- CreateTable
CREATE TABLE "events" (
    "organizer_id" INTEGER NOT NULL,
    "event_id" SERIAL NOT NULL,
    "event_title" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "avaiable_slot" INTEGER NOT NULL,
    "filled_slots" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" SERIAL NOT NULL,
    "category_by_location" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "point_used" INTEGER NOT NULL DEFAULT 0,
    "kupon_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "event_review" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "event_review_pkey" PRIMARY KEY ("event_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reference_number_key" ON "users"("reference_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_by_location_key" ON "categories"("category_by_location");

-- AddForeignKey
ALTER TABLE "kupon_users" ADD CONSTRAINT "kupon_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poin_users" ADD CONSTRAINT "poin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("organizer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
