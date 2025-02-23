/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date]` on the table `activities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "activities_user_id_date_key" ON "activities"("user_id", "date");
