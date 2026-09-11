-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MEMO', 'ANNOUNCEMENT', 'ORDER', 'PETITION', 'CONTRACT', 'REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentUrgency" AS ENUM ('NORMAL', 'URGENT', 'VERY_URGENT', 'MOST_URGENT');

-- CreateEnum
CREATE TYPE "DocumentConfidentiality" AS ENUM ('NORMAL', 'CONFIDENTIAL', 'VERY_CONFIDENTIAL', 'TOP_SECRET');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WorkflowStepStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SKIPPED');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "doc_no" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "doc_type" "DocumentType" NOT NULL DEFAULT 'MEMO',
    "urgency" "DocumentUrgency" NOT NULL DEFAULT 'NORMAL',
    "confidentiality" "DocumentConfidentiality" NOT NULL DEFAULT 'NORMAL',
    "creator_id" UUID NOT NULL,
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "total_steps" INTEGER NOT NULL DEFAULT 1,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT,
    "attachment_url" VARCHAR(500),
    "tags" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_workflow_steps" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "step_number" INTEGER NOT NULL,
    "approver_role" VARCHAR(100) NOT NULL,
    "approver_id" UUID,
    "status" "WorkflowStepStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "signature_url" VARCHAR(500),
    "action_at" TIMESTAMPTZ,

    CONSTRAINT "document_workflow_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_comments" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_tenant_id_status_idx" ON "documents"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "documents_tenant_id_creator_id_idx" ON "documents"("tenant_id", "creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_tenant_id_doc_no_key" ON "documents"("tenant_id", "doc_no");

-- CreateIndex
CREATE INDEX "document_workflow_steps_document_id_idx" ON "document_workflow_steps"("document_id");

-- CreateIndex
CREATE INDEX "document_workflow_steps_approver_id_idx" ON "document_workflow_steps"("approver_id");

-- CreateIndex
CREATE INDEX "document_comments_document_id_idx" ON "document_comments"("document_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_workflow_steps" ADD CONSTRAINT "document_workflow_steps_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_workflow_steps" ADD CONSTRAINT "document_workflow_steps_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_comments" ADD CONSTRAINT "document_comments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_comments" ADD CONSTRAINT "document_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
