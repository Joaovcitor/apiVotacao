/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PollType" AS ENUM ('CHECKBOX', 'TEXT');

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_pollOptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "type" "PollType" NOT NULL DEFAULT 'CHECKBOX';

-- DropTable
DROP TABLE "public"."Vote";

-- CreateTable
CREATE TABLE "CheckboxVote" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "pollId" INTEGER NOT NULL,
    "pollOptionId" INTEGER NOT NULL,

    CONSTRAINT "CheckboxVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextVote" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "pollId" INTEGER NOT NULL,

    CONSTRAINT "TextVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckboxVote_userId_pollOptionId_key" ON "CheckboxVote"("userId", "pollOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "TextVote_userId_pollId_key" ON "TextVote"("userId", "pollId");

-- AddForeignKey
ALTER TABLE "CheckboxVote" ADD CONSTRAINT "CheckboxVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckboxVote" ADD CONSTRAINT "CheckboxVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckboxVote" ADD CONSTRAINT "CheckboxVote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextVote" ADD CONSTRAINT "TextVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextVote" ADD CONSTRAINT "TextVote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
