-- DropForeignKey
ALTER TABLE "public"."Inscription" DROP CONSTRAINT "Inscription_eventId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Inscription" ADD CONSTRAINT "Inscription_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
