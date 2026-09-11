import { prisma } from "@/shared/lib/infra/prisma";
import { writeAudit } from "@/features/identity/server";
import type {
  CreateDocumentInput,
  SubmitDocumentInput,
  ApproveStepInput,
  RejectStepInput,
  AddCommentInput,
} from "./validations";

export interface DocumentWorkflowStepDto {
  id: string;
  documentId: string;
  stepNumber: number;
  approverRole: string;
  approverId: string | null;
  approverName: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED";
  comment: string | null;
  signatureUrl: string | null;
  actionAt: string | null;
}

export interface DocumentCommentDto {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface DocumentDto {
  id: string;
  tenantId: string;
  docNo: string;
  title: string;
  docType: "MEMO" | "ANNOUNCEMENT" | "ORDER" | "PETITION" | "CONTRACT" | "REPORT" | "OTHER";
  urgency: "NORMAL" | "URGENT" | "VERY_URGENT" | "MOST_URGENT";
  confidentiality: "NORMAL" | "CONFIDENTIAL" | "VERY_CONFIDENTIAL" | "TOP_SECRET";
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  currentStep: number;
  totalSteps: number;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED";
  content: string | null;
  attachmentUrl: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  workflowSteps: DocumentWorkflowStepDto[];
  comments: DocumentCommentDto[];
}

export interface DocumentStatsDto {
  totalDocuments: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export async function listDocuments(
  tenantId: string,
  status?: string,
): Promise<DocumentDto[]> {
  const where: Record<string, unknown> = { tenantId };
  if (status && status !== "ALL") {
    where.status = status;
  }

  const docs = await prisma.document.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, email: true } },
      workflowSteps: {
        include: { approver: { select: { id: true, name: true } } },
        orderBy: { stepNumber: "asc" },
      },
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return docs.map((d) => ({
    id: d.id,
    tenantId: d.tenantId,
    docNo: d.docNo,
    title: d.title,
    docType: d.docType,
    urgency: d.urgency,
    confidentiality: d.confidentiality,
    creatorId: d.creatorId,
    creatorName: d.creator.name,
    creatorEmail: d.creator.email,
    currentStep: d.currentStep,
    totalSteps: d.totalSteps,
    status: d.status,
    content: d.content,
    attachmentUrl: d.attachmentUrl,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    workflowSteps: d.workflowSteps.map((s) => ({
      id: s.id,
      documentId: s.documentId,
      stepNumber: s.stepNumber,
      approverRole: s.approverRole,
      approverId: s.approverId,
      approverName: s.approver?.name ?? null,
      status: s.status,
      comment: s.comment,
      signatureUrl: s.signatureUrl,
      actionAt: s.actionAt ? s.actionAt.toISOString() : null,
    })),
    comments: d.comments.map((c) => ({
      id: c.id,
      documentId: c.documentId,
      userId: c.userId,
      userName: c.user.name,
      comment: c.comment,
      createdAt: c.createdAt.toISOString(),
    })),
  }));
}

export async function getDocumentById(
  tenantId: string,
  id: string,
): Promise<DocumentDto | null> {
  const d = await prisma.document.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      workflowSteps: {
        include: { approver: { select: { id: true, name: true } } },
        orderBy: { stepNumber: "asc" },
      },
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!d || d.tenantId !== tenantId) return null;

  return {
    id: d.id,
    tenantId: d.tenantId,
    docNo: d.docNo,
    title: d.title,
    docType: d.docType,
    urgency: d.urgency,
    confidentiality: d.confidentiality,
    creatorId: d.creatorId,
    creatorName: d.creator.name,
    creatorEmail: d.creator.email,
    currentStep: d.currentStep,
    totalSteps: d.totalSteps,
    status: d.status,
    content: d.content,
    attachmentUrl: d.attachmentUrl,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    workflowSteps: d.workflowSteps.map((s) => ({
      id: s.id,
      documentId: s.documentId,
      stepNumber: s.stepNumber,
      approverRole: s.approverRole,
      approverId: s.approverId,
      approverName: s.approver?.name ?? null,
      status: s.status,
      comment: s.comment,
      signatureUrl: s.signatureUrl,
      actionAt: s.actionAt ? s.actionAt.toISOString() : null,
    })),
    comments: d.comments.map((c) => ({
      id: c.id,
      documentId: c.documentId,
      userId: c.userId,
      userName: c.user.name,
      comment: c.comment,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

export async function getDocumentStats(tenantId: string): Promise<DocumentStatsDto> {
  const docs = await prisma.document.findMany({
    where: { tenantId },
    select: { status: true },
  });

  return {
    totalDocuments: docs.length,
    pendingCount: docs.filter((d) => d.status === "PENDING_APPROVAL").length,
    approvedCount: docs.filter((d) => d.status === "APPROVED").length,
    rejectedCount: docs.filter((d) => d.status === "REJECTED").length,
  };
}

export async function createDocument(
  tenantId: string,
  actorId: string,
  input: CreateDocumentInput,
): Promise<DocumentDto> {
  const totalSteps = input.workflowSteps.length;

  const created = await prisma.$transaction(async (tx) => {
    const doc = await tx.document.create({
      data: {
        tenantId,
        docNo: input.docNo,
        title: input.title,
        docType: input.docType,
        urgency: input.urgency,
        confidentiality: input.confidentiality,
        creatorId: actorId,
        currentStep: 1,
        totalSteps,
        status: "DRAFT",
        content: input.content ?? null,
        attachmentUrl: input.attachmentUrl ?? null,
        tags: input.tags ?? [],
        workflowSteps: {
          create: input.workflowSteps.map((s, idx) => ({
            stepNumber: s.stepNumber ?? idx + 1,
            approverRole: s.approverRole,
            status: "PENDING",
          })),
        },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        workflowSteps: {
          include: { approver: { select: { id: true, name: true } } },
          orderBy: { stepNumber: "asc" },
        },
        comments: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "doc.create",
        entity: "documents",
        entityId: doc.id,
        after: { docNo: doc.docNo, title: doc.title, docType: doc.docType },
      },
      tx,
    );

    return doc;
  });

  return {
    id: created.id,
    tenantId: created.tenantId,
    docNo: created.docNo,
    title: created.title,
    docType: created.docType,
    urgency: created.urgency,
    confidentiality: created.confidentiality,
    creatorId: created.creatorId,
    creatorName: created.creator.name,
    creatorEmail: created.creator.email,
    currentStep: created.currentStep,
    totalSteps: created.totalSteps,
    status: created.status,
    content: created.content,
    attachmentUrl: created.attachmentUrl,
    tags: Array.isArray(created.tags) ? (created.tags as string[]) : [],
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
    workflowSteps: created.workflowSteps.map((s) => ({
      id: s.id,
      documentId: s.documentId,
      stepNumber: s.stepNumber,
      approverRole: s.approverRole,
      approverId: s.approverId,
      approverName: s.approver?.name ?? null,
      status: s.status,
      comment: s.comment,
      signatureUrl: s.signatureUrl,
      actionAt: s.actionAt ? s.actionAt.toISOString() : null,
    })),
    comments: [],
  };
}

export async function submitDocument(
  tenantId: string,
  actorId: string,
  input: SubmitDocumentInput,
): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: input.id, tenantId },
  });
  if (!doc) throw new Error("Document not found");
  if (doc.status !== "DRAFT") throw new Error("Only draft documents can be submitted");

  await prisma.$transaction(async (tx) => {
    await tx.document.update({
      where: { id: input.id },
      data: {
        status: "PENDING_APPROVAL",
        currentStep: 1,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "doc.submit",
        entity: "documents",
        entityId: input.id,
        before: { status: "DRAFT" },
        after: { status: "PENDING_APPROVAL", currentStep: 1 },
      },
      tx,
    );
  });
}

export async function approveStep(
  tenantId: string,
  actorId: string,
  input: ApproveStepInput,
): Promise<void> {
  const step = await prisma.documentWorkflowStep.findUnique({
    where: { id: input.stepId },
    include: { document: true },
  });

  if (!step || step.document.tenantId !== tenantId) {
    throw new Error("Workflow step not found");
  }

  const doc = step.document;
  if (doc.status !== "PENDING_APPROVAL") {
    throw new Error("Document is not in pending approval state");
  }

  if (doc.currentStep !== step.stepNumber) {
    throw new Error("Step is not the current active step in workflow");
  }

  await prisma.$transaction(async (tx) => {
    await tx.documentWorkflowStep.update({
      where: { id: input.stepId },
      data: {
        status: "APPROVED",
        approverId: actorId,
        comment: input.comment ?? null,
        signatureUrl: input.signatureUrl ?? null,
        actionAt: new Date(),
      },
    });

    const isLastStep = step.stepNumber >= doc.totalSteps;
    const nextStatus = isLastStep ? "APPROVED" : "PENDING_APPROVAL";
    const nextStep = isLastStep ? doc.totalSteps : doc.currentStep + 1;

    await tx.document.update({
      where: { id: doc.id },
      data: {
        status: nextStatus,
        currentStep: nextStep,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "doc.approve_step",
        entity: "document_workflow_steps",
        entityId: input.stepId,
        after: {
          stepNumber: step.stepNumber,
          isLastStep,
          docStatus: nextStatus,
          comment: input.comment,
        },
      },
      tx,
    );
  });
}

export async function rejectStep(
  tenantId: string,
  actorId: string,
  input: RejectStepInput,
): Promise<void> {
  const step = await prisma.documentWorkflowStep.findUnique({
    where: { id: input.stepId },
    include: { document: true },
  });

  if (!step || step.document.tenantId !== tenantId) {
    throw new Error("Workflow step not found");
  }

  const doc = step.document;
  if (doc.status !== "PENDING_APPROVAL") {
    throw new Error("Document is not in pending approval state");
  }

  await prisma.$transaction(async (tx) => {
    await tx.documentWorkflowStep.update({
      where: { id: input.stepId },
      data: {
        status: "REJECTED",
        approverId: actorId,
        comment: input.comment,
        actionAt: new Date(),
      },
    });

    await tx.document.update({
      where: { id: doc.id },
      data: {
        status: "REJECTED",
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "doc.reject_step",
        entity: "document_workflow_steps",
        entityId: input.stepId,
        after: {
          stepNumber: step.stepNumber,
          docStatus: "REJECTED",
          comment: input.comment,
        },
      },
      tx,
    );
  });
}

export async function addDocumentComment(
  tenantId: string,
  actorId: string,
  input: AddCommentInput,
): Promise<void> {
  const doc = await prisma.document.findUnique({
    where: { id: input.documentId, tenantId },
  });
  if (!doc) throw new Error("Document not found");

  await prisma.$transaction(async (tx) => {
    const comment = await tx.documentComment.create({
      data: {
        documentId: input.documentId,
        userId: actorId,
        comment: input.comment,
      },
    });

    await writeAudit(
      {
        tenantId,
        actorId,
        action: "doc.add_comment",
        entity: "document_comments",
        entityId: comment.id,
        after: { documentId: input.documentId, comment: input.comment },
      },
      tx,
    );
  });
}
