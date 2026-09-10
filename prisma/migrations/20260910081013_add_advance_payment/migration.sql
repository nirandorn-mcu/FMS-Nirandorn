-- CreateEnum
CREATE TYPE "AdvanceStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLEARED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ClearingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "sample_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sample_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "req_no" VARCHAR(50) NOT NULL,
    "borrower_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "event_start_date" DATE NOT NULL,
    "event_end_date" DATE NOT NULL,
    "due_date_clearing" DATE NOT NULL,
    "status" "AdvanceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "bank_name" VARCHAR(100),
    "bank_account_name" VARCHAR(255),
    "bank_account_no" VARCHAR(50),
    "approved_at" TIMESTAMPTZ,
    "approver_id" UUID,
    "rejection_reason" TEXT,
    "disbursed_at" TIMESTAMPTZ,
    "disbursed_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "advance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_items" (
    "id" UUID NOT NULL,
    "advance_request_id" UUID NOT NULL,
    "item_description" VARCHAR(255) NOT NULL,
    "estimated_amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advance_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_clearings" (
    "id" UUID NOT NULL,
    "advance_request_id" UUID NOT NULL,
    "actual_expense_total" DECIMAL(12,2) NOT NULL,
    "refund_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reimburse_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "clearing_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "receipt_proof_url" VARCHAR(500),
    "cleared_by_id" UUID,
    "status" "ClearingStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "advance_clearings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advance_clearing_items" (
    "id" UUID NOT NULL,
    "clearing_id" UUID NOT NULL,
    "receipt_no" VARCHAR(100),
    "receipt_date" DATE NOT NULL,
    "expense_title" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advance_clearing_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sample_items_tenant_id_idx" ON "sample_items"("tenant_id");

-- CreateIndex
CREATE INDEX "advance_requests_tenant_id_borrower_id_idx" ON "advance_requests"("tenant_id", "borrower_id");

-- CreateIndex
CREATE INDEX "advance_requests_tenant_id_status_idx" ON "advance_requests"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "advance_requests_tenant_id_req_no_key" ON "advance_requests"("tenant_id", "req_no");

-- CreateIndex
CREATE INDEX "advance_items_advance_request_id_idx" ON "advance_items"("advance_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "advance_clearings_advance_request_id_key" ON "advance_clearings"("advance_request_id");

-- CreateIndex
CREATE INDEX "advance_clearing_items_clearing_id_idx" ON "advance_clearing_items"("clearing_id");

-- AddForeignKey
ALTER TABLE "sample_items" ADD CONSTRAINT "sample_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_requests" ADD CONSTRAINT "advance_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_requests" ADD CONSTRAINT "advance_requests_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_requests" ADD CONSTRAINT "advance_requests_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_requests" ADD CONSTRAINT "advance_requests_disbursed_by_id_fkey" FOREIGN KEY ("disbursed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_items" ADD CONSTRAINT "advance_items_advance_request_id_fkey" FOREIGN KEY ("advance_request_id") REFERENCES "advance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_clearings" ADD CONSTRAINT "advance_clearings_advance_request_id_fkey" FOREIGN KEY ("advance_request_id") REFERENCES "advance_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_clearings" ADD CONSTRAINT "advance_clearings_cleared_by_id_fkey" FOREIGN KEY ("cleared_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advance_clearing_items" ADD CONSTRAINT "advance_clearing_items_clearing_id_fkey" FOREIGN KEY ("clearing_id") REFERENCES "advance_clearings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
