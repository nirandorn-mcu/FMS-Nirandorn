import { prisma } from "@/shared/lib/infra/prisma";
import { writeAudit } from "@/features/identity/server";
import type {
  CreateAdvanceRequestInput,
  ApproveAdvanceRequestInput,
  RejectAdvanceRequestInput,
  DisburseAdvanceRequestInput,
  SubmitClearingInput,
  ApproveClearingInput,
} from "./validations";

export interface AdvanceItemDto {
  id: string;
  itemDescription: string;
  estimatedAmount: number;
}

export interface AdvanceClearingItemDto {
  id: string;
  receiptNo: string | null;
  receiptDate: string;
  expenseTitle: string;
  amount: number;
}

export interface AdvanceClearingDto {
  id: string;
  advanceRequestId: string;
  actualExpenseTotal: number;
  refundAmount: number;
  reimburseAmount: number;
  clearingDate: string;
  notes: string | null;
  receiptProofUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  clearedBy?: { id: string; name: string } | null;
  items: AdvanceClearingItemDto[];
}

export interface AdvanceRequestDto {
  id: string;
  tenantId: string;
  reqNo: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  title: string;
  description: string | null;
  amount: number;
  eventStartDate: string;
  eventEndDate: string;
  dueDateClearing: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "DISBURSED" | "CLEARED" | "OVERDUE";
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNo: string | null;
  approvedAt: string | null;
  approverName: string | null;
  rejectionReason: string | null;
  disbursedAt: string | null;
  disburserName: string | null;
  createdAt: string;
  updatedAt: string;
  items: AdvanceItemDto[];
  clearing: AdvanceClearingDto | null;
}

export interface AdvanceStatsDto {
  totalOutstandingAmount: number;
  pendingApprovalCount: number;
  pendingClearingCount: number;
  overdueCount: number;
}

/** สร้างรหัสคำขอรันนัมเบอร์ เช่น ADV-2026-0001 */
async function generateReqNo(tenantId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `ADV-${currentYear}-`;
  const count = await prisma.advanceRequest.count({
    where: {
      tenantId,
      reqNo: { startsWith: prefix },
    },
  });
  return `${prefix}${(count + 1).toString().padStart(4, "0")}`;
}

export async function listAdvanceRequests(
  tenantId: string,
  userId?: string,
  hasManagerRole: boolean = false,
): Promise<AdvanceRequestDto[]> {
  const whereClause: Record<string, unknown> = { tenantId };
  
  // หากไม่มีสิทธิ์บริหารจัดการ ให้เห็นเฉพาะของตัวเอง
  if (!hasManagerRole && userId) {
    whereClause.borrowerId = userId;
  }

  // อัปเดตสถานะ OVERDUE อัตโนมัติสำหรับรายการที่ DISBURSED และเลย dueDateClearing
  const now = new Date();
  await prisma.advanceRequest.updateMany({
    where: {
      tenantId,
      status: "DISBURSED",
      dueDateClearing: { lt: now },
    },
    data: { status: "OVERDUE" },
  });

  const records = await prisma.advanceRequest.findMany({
    where: whereClause,
    include: {
      borrower: { select: { id: true, name: true, email: true } },
      approver: { select: { id: true, name: true } },
      disburser: { select: { id: true, name: true } },
      items: true,
      clearing: {
        include: {
          clearingOfficer: { select: { id: true, name: true } },
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    reqNo: r.reqNo,
    borrowerId: r.borrowerId,
    borrowerName: r.borrower.name,
    borrowerEmail: r.borrower.email,
    title: r.title,
    description: r.description,
    amount: Number(r.amount),
    eventStartDate: r.eventStartDate.toISOString().split("T")[0],
    eventEndDate: r.eventEndDate.toISOString().split("T")[0],
    dueDateClearing: r.dueDateClearing.toISOString().split("T")[0],
    status: r.status,
    bankName: r.bankName,
    bankAccountName: r.bankAccountName,
    bankAccountNo: r.bankAccountNo,
    approvedAt: r.approvedAt?.toISOString() ?? null,
    approverName: r.approver?.name ?? null,
    rejectionReason: r.rejectionReason,
    disbursedAt: r.disbursedAt?.toISOString() ?? null,
    disburserName: r.disburser?.name ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    items: r.items.map((it) => ({
      id: it.id,
      itemDescription: it.itemDescription,
      estimatedAmount: Number(it.estimatedAmount),
    })),
    clearing: r.clearing
      ? {
          id: r.clearing.id,
          advanceRequestId: r.clearing.advanceRequestId,
          actualExpenseTotal: Number(r.clearing.actualExpenseTotal),
          refundAmount: Number(r.clearing.refundAmount),
          reimburseAmount: Number(r.clearing.reimburseAmount),
          clearingDate: r.clearing.clearingDate.toISOString(),
          notes: r.clearing.notes,
          receiptProofUrl: r.clearing.receiptProofUrl,
          status: r.clearing.status,
          clearedBy: r.clearing.clearingOfficer
            ? { id: r.clearing.clearingOfficer.id, name: r.clearing.clearingOfficer.name }
            : null,
          items: r.clearing.items.map((ci) => ({
            id: ci.id,
            receiptNo: ci.receiptNo,
            receiptDate: ci.receiptDate.toISOString().split("T")[0],
            expenseTitle: ci.expenseTitle,
            amount: Number(ci.amount),
          })),
        }
      : null,
  }));
}

export async function getAdvanceStats(
  tenantId: string,
  userId?: string,
  hasManagerRole: boolean = false,
): Promise<AdvanceStatsDto> {
  const where: Record<string, unknown> = { tenantId };
  if (!hasManagerRole && userId) {
    where.borrowerId = userId;
  }

  const [disbursed, pendingApproval, pendingClearing, overdue] = await Promise.all([
    prisma.advanceRequest.findMany({
      where: { ...where, status: { in: ["DISBURSED", "OVERDUE"] } },
      select: { amount: true },
    }),
    prisma.advanceRequest.count({
      where: { ...where, status: "SUBMITTED" },
    }),
    prisma.advanceRequest.count({
      where: { ...where, status: "DISBURSED" },
    }),
    prisma.advanceRequest.count({
      where: { ...where, status: "OVERDUE" },
    }),
  ]);

  const totalOutstandingAmount = disbursed.reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    totalOutstandingAmount,
    pendingApprovalCount: pendingApproval,
    pendingClearingCount: pendingClearing,
    overdueCount: overdue,
  };
}

export async function createAdvanceRequest(
  tenantId: string,
  borrowerId: string,
  input: CreateAdvanceRequestInput,
): Promise<AdvanceRequestDto> {
  // ตรวจสอบว่ามีรายการ OVERDUE ค้างอยู่หรือไม่
  const overdueCount = await prisma.advanceRequest.count({
    where: { tenantId, borrowerId, status: "OVERDUE" },
  });
  if (overdueCount > 0) {
    throw new Error("advance.overdueWarning");
  }

  const reqNo = await generateReqNo(tenantId);
  const eventStartDate = new Date(input.eventStartDate);
  const eventEndDate = new Date(input.eventEndDate);

  // คำนวณวันกำหนดเคลียร์เงิน (15 วันหลังสิ้นสุดกิจกรรม หากไม่ได้ระบุมา)
  const dueDateClearing = input.dueDateClearing
    ? new Date(input.dueDateClearing)
    : new Date(eventEndDate.getTime() + 15 * 24 * 60 * 60 * 1000);

  const created = await prisma.$transaction(async (tx) => {
    const adv = await tx.advanceRequest.create({
      data: {
        tenantId,
        reqNo,
        borrowerId,
        title: input.title,
        description: input.description ?? null,
        amount: input.amount,
        eventStartDate,
        eventEndDate,
        dueDateClearing,
        status: "SUBMITTED",
        bankName: input.bankName ?? null,
        bankAccountName: input.bankAccountName ?? null,
        bankAccountNo: input.bankAccountNo ?? null,
        items: {
          create: input.items.map((item) => ({
            itemDescription: item.itemDescription,
            estimatedAmount: item.estimatedAmount,
          })),
        },
      },
      include: {
        borrower: { select: { id: true, name: true, email: true } },
        items: true,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: borrowerId,
        action: "advance.create",
        entity: "advance_requests",
        entityId: adv.id,
        after: { reqNo: adv.reqNo, amount: input.amount, title: input.title },
      },
      tx,
    );

    return adv;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    reqNo: created.reqNo,
    borrowerId: created.borrowerId,
    borrowerName: created.borrower.name,
    borrowerEmail: created.borrower.email,
    title: created.title,
    description: created.description,
    amount: Number(created.amount),
    eventStartDate: created.eventStartDate.toISOString().split("T")[0],
    eventEndDate: created.eventEndDate.toISOString().split("T")[0],
    dueDateClearing: created.dueDateClearing.toISOString().split("T")[0],
    status: created.status,
    bankName: created.bankName,
    bankAccountName: created.bankAccountName,
    bankAccountNo: created.bankAccountNo,
    approvedAt: null,
    approverName: null,
    rejectionReason: null,
    disbursedAt: null,
    disburserName: null,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    items: created.items.map((it) => ({
      id: it.id,
      itemDescription: it.itemDescription,
      estimatedAmount: Number(it.estimatedAmount),
    })),
    clearing: null,
  };
}

export async function approveAdvanceRequest(
  tenantId: string,
  actorId: string,
  input: ApproveAdvanceRequestInput,
): Promise<void> {
  const req = await prisma.advanceRequest.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!req || req.status !== "SUBMITTED") {
    throw new Error("Invalid advance request state for approval");
  }

  await prisma.$transaction(async (tx) => {
    await tx.advanceRequest.update({
      where: { id: input.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approverId: actorId,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "advance.approve",
        entity: "advance_requests",
        entityId: input.id,
        before: { status: req.status },
        after: { status: "APPROVED" },
      },
      tx,
    );
  });
}

export async function rejectAdvanceRequest(
  tenantId: string,
  actorId: string,
  input: RejectAdvanceRequestInput,
): Promise<void> {
  const req = await prisma.advanceRequest.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!req || req.status !== "SUBMITTED") {
    throw new Error("Invalid advance request state for rejection");
  }

  await prisma.$transaction(async (tx) => {
    await tx.advanceRequest.update({
      where: { id: input.id },
      data: {
        status: "REJECTED",
        rejectionReason: input.reason,
        approverId: actorId,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "advance.reject",
        entity: "advance_requests",
        entityId: input.id,
        before: { status: req.status },
        after: { status: "REJECTED", reason: input.reason },
      },
      tx,
    );
  });
}

export async function disburseAdvanceRequest(
  tenantId: string,
  actorId: string,
  input: DisburseAdvanceRequestInput,
): Promise<void> {
  const req = await prisma.advanceRequest.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!req || req.status !== "APPROVED") {
    throw new Error("Advance request must be APPROVED before disbursement");
  }

  await prisma.$transaction(async (tx) => {
    await tx.advanceRequest.update({
      where: { id: input.id },
      data: {
        status: "DISBURSED",
        disbursedAt: new Date(),
        disbursedById: actorId,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "advance.disburse",
        entity: "advance_requests",
        entityId: input.id,
        before: { status: req.status },
        after: { status: "DISBURSED" },
      },
      tx,
    );
  });
}

export async function submitClearing(
  tenantId: string,
  actorId: string,
  input: SubmitClearingInput,
): Promise<void> {
  const adv = await prisma.advanceRequest.findUnique({
    where: { id: input.advanceRequestId, tenantId },
  });
  if (!adv || (adv.status !== "DISBURSED" && adv.status !== "OVERDUE")) {
    throw new Error("Cannot submit clearing for advance in current state");
  }

  const borrowAmount = Number(adv.amount);
  const actualExpenseTotal = input.actualExpenseTotal;
  let refundAmount = 0;
  let reimburseAmount = 0;

  if (actualExpenseTotal < borrowAmount) {
    refundAmount = borrowAmount - actualExpenseTotal;
  } else if (actualExpenseTotal > borrowAmount) {
    reimburseAmount = actualExpenseTotal - borrowAmount;
  }

  await prisma.$transaction(async (tx) => {
    // ลบ clearing เดิมถ้ามีอยู่
    await tx.advanceClearing.deleteMany({
      where: { advanceRequestId: input.advanceRequestId },
    });

    await tx.advanceClearing.create({
      data: {
        advanceRequestId: input.advanceRequestId,
        actualExpenseTotal,
        refundAmount,
        reimburseAmount,
        notes: input.notes ?? null,
        receiptProofUrl: input.receiptProofUrl ?? null,
        status: "PENDING",
        items: {
          create: input.items.map((it) => ({
            receiptNo: it.receiptNo ?? null,
            receiptDate: new Date(it.receiptDate),
            expenseTitle: it.expenseTitle,
            amount: it.amount,
          })),
        },
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "advance.submit_clearing",
        entity: "advance_clearings",
        entityId: input.advanceRequestId,
        after: { actualExpenseTotal, refundAmount, reimburseAmount },
      },
      tx,
    );
  });
}

export async function approveClearing(
  tenantId: string,
  actorId: string,
  input: ApproveClearingInput,
): Promise<void> {
  const clearing = await prisma.advanceClearing.findUnique({
    where: { id: input.clearingId },
    include: { advanceRequest: true },
  });
  if (!clearing || clearing.advanceRequest.tenantId !== tenantId) {
    throw new Error("Clearing record not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.advanceClearing.update({
      where: { id: input.clearingId },
      data: {
        status: "APPROVED",
        clearedById: actorId,
      },
    });

    await tx.advanceRequest.update({
      where: { id: clearing.advanceRequestId },
      data: {
        status: "CLEARED",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "advance.approve_clearing",
        entity: "advance_clearings",
        entityId: input.clearingId,
        before: { status: clearing.status },
        after: { status: "APPROVED", advanceStatus: "CLEARED" },
      },
      tx,
    );
  });
}
