-- CreateEnum
CREATE TYPE "PetitionType" AS ENUM ('LATE_ENROLL', 'LEAVE', 'RESIGN', 'TUITION_WAIVER', 'COURSE_ADD_DROP', 'GENERAL');

-- CreateEnum
CREATE TYPE "PetitionStatus" AS ENUM ('SUBMITTED', 'ADVISOR_APPROVED', 'OFFICER_APPROVED', 'DEAN_APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "student_petitions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "ticket_no" VARCHAR(50) NOT NULL,
    "student_id" UUID NOT NULL,
    "student_code" VARCHAR(50) NOT NULL,
    "student_name" VARCHAR(255) NOT NULL,
    "student_email" VARCHAR(255) NOT NULL,
    "major" VARCHAR(100) NOT NULL,
    "year_level" INTEGER NOT NULL,
    "petition_type" "PetitionType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "details" TEXT NOT NULL,
    "evidence_urls" JSONB NOT NULL DEFAULT '[]',
    "status" "PetitionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "advisor_id" UUID,
    "advisor_comment" TEXT,
    "advisor_action_at" TIMESTAMPTZ,
    "officer_id" UUID,
    "officer_comment" TEXT,
    "officer_action_at" TIMESTAMPTZ,
    "dean_id" UUID,
    "dean_comment" TEXT,
    "dean_action_at" TIMESTAMPTZ,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "student_petitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_petition_logs" (
    "id" UUID NOT NULL,
    "petition_id" UUID NOT NULL,
    "actor_id" UUID,
    "actor_name" VARCHAR(255) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "status_from" "PetitionStatus",
    "status_to" "PetitionStatus" NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_petition_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_petitions_tenant_id_student_id_idx" ON "student_petitions"("tenant_id", "student_id");

-- CreateIndex
CREATE INDEX "student_petitions_tenant_id_status_idx" ON "student_petitions"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_petitions_tenant_id_ticket_no_key" ON "student_petitions"("tenant_id", "ticket_no");

-- CreateIndex
CREATE INDEX "student_petition_logs_petition_id_idx" ON "student_petition_logs"("petition_id");

-- AddForeignKey
ALTER TABLE "student_petitions" ADD CONSTRAINT "student_petitions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_petitions" ADD CONSTRAINT "student_petitions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_petitions" ADD CONSTRAINT "student_petitions_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_petitions" ADD CONSTRAINT "student_petitions_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_petitions" ADD CONSTRAINT "student_petitions_dean_id_fkey" FOREIGN KEY ("dean_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_petition_logs" ADD CONSTRAINT "student_petition_logs_petition_id_fkey" FOREIGN KEY ("petition_id") REFERENCES "student_petitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
