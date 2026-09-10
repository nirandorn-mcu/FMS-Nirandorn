import { prisma } from "@/shared/lib/infra/prisma";
import { writeAudit } from "@/features/identity/server";
import type {
  CreatePetitionInput,
  AdvisorReviewInput,
  OfficerReviewInput,
  DeanReviewInput,
  RejectPetitionInput,
  CancelPetitionInput,
} from "./validations";

export interface StudentPetitionLogDto {
  id: string;
  actorName: string;
  action: string;
  statusFrom: string | null;
  statusTo: string;
  comment: string | null;
  createdAt: string;
}

export interface StudentPetitionDto {
  id: string;
  tenantId: string;
  ticketNo: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  studentEmail: string;
  major: string;
  yearLevel: number;
  petitionType: "LATE_ENROLL" | "LEAVE" | "RESIGN" | "TUITION_WAIVER" | "COURSE_ADD_DROP" | "GENERAL";
  title: string;
  details: string;
  evidenceUrls: string[];
  status: "SUBMITTED" | "ADVISOR_APPROVED" | "OFFICER_APPROVED" | "DEAN_APPROVED" | "REJECTED" | "CANCELLED";
  
  advisorName: string | null;
  advisorComment: string | null;
  advisorActionAt: string | null;

  officerName: string | null;
  officerComment: string | null;
  officerActionAt: string | null;

  deanName: string | null;
  deanComment: string | null;
  deanActionAt: string | null;

  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  logs: StudentPetitionLogDto[];
}

export interface PetitionStatsDto {
  totalCount: number;
  pendingAdvisorCount: number;
  pendingOfficerCount: number;
  pendingDeanCount: number;
  completedCount: number;
  rejectedCount: number;
}

async function generateTicketNo(tenantId: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `PET-${currentYear}-`;
  const count = await prisma.studentPetition.count({
    where: {
      tenantId,
      ticketNo: { startsWith: prefix },
    },
  });
  return `${prefix}${(count + 1).toString().padStart(4, "0")}`;
}

export async function listPetitions(
  tenantId: string,
  userId?: string,
  isStaffOrAdmin: boolean = false,
): Promise<StudentPetitionDto[]> {
  const where: Record<string, unknown> = { tenantId };
  if (!isStaffOrAdmin && userId) {
    where.studentId = userId;
  }

  const records = await prisma.studentPetition.findMany({
    where,
    include: {
      advisor: { select: { id: true, name: true } },
      officer: { select: { id: true, name: true } },
      dean: { select: { id: true, name: true } },
      logs: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return records.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    ticketNo: r.ticketNo,
    studentId: r.studentId,
    studentCode: r.studentCode,
    studentName: r.studentName,
    studentEmail: r.studentEmail,
    major: r.major,
    yearLevel: r.yearLevel,
    petitionType: r.petitionType,
    title: r.title,
    details: r.details,
    evidenceUrls: Array.isArray(r.evidenceUrls) ? (r.evidenceUrls as string[]) : [],
    status: r.status,
    advisorName: r.advisor?.name ?? null,
    advisorComment: r.advisorComment,
    advisorActionAt: r.advisorActionAt?.toISOString() ?? null,
    officerName: r.officer?.name ?? null,
    officerComment: r.officerComment,
    officerActionAt: r.officerActionAt?.toISOString() ?? null,
    deanName: r.dean?.name ?? null,
    deanComment: r.deanComment,
    deanActionAt: r.deanActionAt?.toISOString() ?? null,
    rejectionReason: r.rejectionReason,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    logs: r.logs.map((l) => ({
      id: l.id,
      actorName: l.actorName,
      action: l.action,
      statusFrom: l.statusFrom,
      statusTo: l.statusTo,
      comment: l.comment,
      createdAt: l.createdAt.toISOString(),
    })),
  }));
}

export async function getPetitionStats(
  tenantId: string,
  userId?: string,
  isStaffOrAdmin: boolean = false,
): Promise<PetitionStatsDto> {
  const where: Record<string, unknown> = { tenantId };
  if (!isStaffOrAdmin && userId) {
    where.studentId = userId;
  }

  const [total, pendingAdvisor, pendingOfficer, pendingDean, completed, rejected] = await Promise.all([
    prisma.studentPetition.count({ where }),
    prisma.studentPetition.count({ where: { ...where, status: "SUBMITTED" } }),
    prisma.studentPetition.count({ where: { ...where, status: "ADVISOR_APPROVED" } }),
    prisma.studentPetition.count({ where: { ...where, status: "OFFICER_APPROVED" } }),
    prisma.studentPetition.count({ where: { ...where, status: "DEAN_APPROVED" } }),
    prisma.studentPetition.count({ where: { ...where, status: "REJECTED" } }),
  ]);

  return {
    totalCount: total,
    pendingAdvisorCount: pendingAdvisor,
    pendingOfficerCount: pendingOfficer,
    pendingDeanCount: pendingDean,
    completedCount: completed,
    rejectedCount: rejected,
  };
}

export async function createPetition(
  tenantId: string,
  studentUserId: string,
  input: CreatePetitionInput,
): Promise<StudentPetitionDto> {
  const ticketNo = await generateTicketNo(tenantId);

  const created = await prisma.$transaction(async (tx) => {
    const p = await tx.studentPetition.create({
      data: {
        tenantId,
        ticketNo,
        studentId: studentUserId,
        studentCode: input.studentCode,
        studentName: input.studentName,
        studentEmail: input.studentEmail,
        major: input.major,
        yearLevel: input.yearLevel,
        petitionType: input.petitionType,
        title: input.title,
        details: input.details,
        evidenceUrls: input.evidenceUrls ?? [],
        status: "SUBMITTED",
        logs: {
          create: {
            actorId: studentUserId,
            actorName: input.studentName,
            action: "petition.submit",
            statusFrom: null,
            statusTo: "SUBMITTED",
            comment: "ยื่นคำร้องเข้าสู่ระบบ",
          },
        },
      },
      include: {
        logs: true,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: studentUserId,
        action: "petition.create",
        entity: "student_petitions",
        entityId: p.id,
        after: { ticketNo: p.ticketNo, type: p.petitionType, title: p.title },
      },
      tx,
    );

    return p;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    ticketNo: created.ticketNo,
    studentId: created.studentId,
    studentCode: created.studentCode,
    studentName: created.studentName,
    studentEmail: created.studentEmail,
    major: created.major,
    yearLevel: created.yearLevel,
    petitionType: created.petitionType,
    title: created.title,
    details: created.details,
    evidenceUrls: Array.isArray(created.evidenceUrls) ? (created.evidenceUrls as string[]) : [],
    status: created.status,
    advisorName: null,
    advisorComment: null,
    advisorActionAt: null,
    officerName: null,
    officerComment: null,
    officerActionAt: null,
    deanName: null,
    deanComment: null,
    deanActionAt: null,
    rejectionReason: null,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    logs: created.logs.map((l) => ({
      id: l.id,
      actorName: l.actorName,
      action: l.action,
      statusFrom: l.statusFrom,
      statusTo: l.statusTo,
      comment: l.comment,
      createdAt: l.createdAt.toISOString(),
    })),
  };
}

export async function reviewByAdvisor(
  tenantId: string,
  advisorId: string,
  advisorName: string,
  input: AdvisorReviewInput,
): Promise<void> {
  const p = await prisma.studentPetition.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p || p.status !== "SUBMITTED") {
    throw new Error("Petition is not in SUBMITTED state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentPetition.update({
      where: { id: input.id },
      data: {
        status: "ADVISOR_APPROVED",
        advisorId,
        advisorComment: input.comment ?? null,
        advisorActionAt: new Date(),
      },
    });

    await tx.studentPetitionLog.create({
      data: {
        petitionId: input.id,
        actorId: advisorId,
        actorName: advisorName,
        action: "advisor.approve",
        statusFrom: "SUBMITTED",
        statusTo: "ADVISOR_APPROVED",
        comment: input.comment ?? "อาจารย์ที่ปรึกษาให้ความเห็นชอบ",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: advisorId,
        action: "petition.advisor_approve",
        entity: "student_petitions",
        entityId: input.id,
        before: { status: "SUBMITTED" },
        after: { status: "ADVISOR_APPROVED", comment: input.comment },
      },
      tx,
    );
  });
}

export async function reviewByOfficer(
  tenantId: string,
  officerId: string,
  officerName: string,
  input: OfficerReviewInput,
): Promise<void> {
  const p = await prisma.studentPetition.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p || p.status !== "ADVISOR_APPROVED") {
    throw new Error("Petition is not in ADVISOR_APPROVED state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentPetition.update({
      where: { id: input.id },
      data: {
        status: "OFFICER_APPROVED",
        officerId,
        officerComment: input.comment ?? null,
        officerActionAt: new Date(),
      },
    });

    await tx.studentPetitionLog.create({
      data: {
        petitionId: input.id,
        actorId: officerId,
        actorName: officerName,
        action: "officer.approve",
        statusFrom: "ADVISOR_APPROVED",
        statusTo: "OFFICER_APPROVED",
        comment: input.comment ?? "ฝ่ายทะเบียนตรวจสอบและส่งต่อ",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: officerId,
        action: "petition.officer_approve",
        entity: "student_petitions",
        entityId: input.id,
        before: { status: "ADVISOR_APPROVED" },
        after: { status: "OFFICER_APPROVED", comment: input.comment },
      },
      tx,
    );
  });
}

export async function reviewByDean(
  tenantId: string,
  deanId: string,
  deanName: string,
  input: DeanReviewInput,
): Promise<void> {
  const p = await prisma.studentPetition.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p || p.status !== "OFFICER_APPROVED") {
    throw new Error("Petition is not in OFFICER_APPROVED state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentPetition.update({
      where: { id: input.id },
      data: {
        status: "DEAN_APPROVED",
        deanId,
        deanComment: input.comment ?? null,
        deanActionAt: new Date(),
      },
    });

    await tx.studentPetitionLog.create({
      data: {
        petitionId: input.id,
        actorId: deanId,
        actorName: deanName,
        action: "dean.approve",
        statusFrom: "OFFICER_APPROVED",
        statusTo: "DEAN_APPROVED",
        comment: input.comment ?? "คณบดีอนุมัติคำร้อง",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: deanId,
        action: "petition.dean_approve",
        entity: "student_petitions",
        entityId: input.id,
        before: { status: "OFFICER_APPROVED" },
        after: { status: "DEAN_APPROVED", comment: input.comment },
      },
      tx,
    );
  });
}

export async function rejectPetition(
  tenantId: string,
  actorId: string,
  actorName: string,
  input: RejectPetitionInput,
): Promise<void> {
  const p = await prisma.studentPetition.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p || p.status === "DEAN_APPROVED" || p.status === "REJECTED" || p.status === "CANCELLED") {
    throw new Error("Cannot reject petition in current state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentPetition.update({
      where: { id: input.id },
      data: {
        status: "REJECTED",
        rejectionReason: input.reason,
      },
    });

    await tx.studentPetitionLog.create({
      data: {
        petitionId: input.id,
        actorId,
        actorName,
        action: "petition.reject",
        statusFrom: p.status,
        statusTo: "REJECTED",
        comment: `ไม่อนุมัติ/ตีกลับ: ${input.reason}`,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "petition.reject",
        entity: "student_petitions",
        entityId: input.id,
        before: { status: p.status },
        after: { status: "REJECTED", reason: input.reason },
      },
      tx,
    );
  });
}

export async function cancelPetition(
  tenantId: string,
  studentId: string,
  actorName: string,
  input: CancelPetitionInput,
): Promise<void> {
  const p = await prisma.studentPetition.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!p || p.studentId !== studentId || p.status !== "SUBMITTED") {
    throw new Error("Can only cancel petitions in SUBMITTED state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.studentPetition.update({
      where: { id: input.id },
      data: { status: "CANCELLED" },
    });

    await tx.studentPetitionLog.create({
      data: {
        petitionId: input.id,
        actorId: studentId,
        actorName,
        action: "petition.cancel",
        statusFrom: "SUBMITTED",
        statusTo: "CANCELLED",
        comment: "นิสิตยกเลิกคำร้องด้วยตนเอง",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId: studentId,
        action: "petition.cancel",
        entity: "student_petitions",
        entityId: input.id,
        before: { status: "SUBMITTED" },
        after: { status: "CANCELLED" },
      },
      tx,
    );
  });
}
