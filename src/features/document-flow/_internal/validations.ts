import { z } from "zod";

export const documentTypeEnum = z.enum([
  "MEMO",
  "ANNOUNCEMENT",
  "ORDER",
  "PETITION",
  "CONTRACT",
  "REPORT",
  "OTHER",
]);

export const documentUrgencyEnum = z.enum([
  "NORMAL",
  "URGENT",
  "VERY_URGENT",
  "MOST_URGENT",
]);

export const documentConfidentialityEnum = z.enum([
  "NORMAL",
  "CONFIDENTIAL",
  "VERY_CONFIDENTIAL",
  "TOP_SECRET",
]);

export const documentStatusEnum = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

export const workflowStepStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SKIPPED",
]);

export const createWorkflowStepSchema = z.object({
  stepNumber: z.number().int().positive().optional(),
  approverRole: z.string().min(1).max(100),
});

export const createDocumentSchema = z.object({
  docNo: z.string().min(1).max(50),
  title: z.string().min(1).max(255),
  docType: documentTypeEnum.default("MEMO"),
  urgency: documentUrgencyEnum.default("NORMAL"),
  confidentiality: documentConfidentialityEnum.default("NORMAL"),
  content: z.string().optional().nullable(),
  attachmentUrl: z.string().url().max(500).optional().nullable().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  workflowSteps: z.array(createWorkflowStepSchema).min(1, "ต้องมีขั้นตอนการพิจารณาอย่างน้อย 1 ขั้นตอน"),
});

export const submitDocumentSchema = z.object({
  id: z.string().uuid(),
});

export const approveStepSchema = z.object({
  stepId: z.string().uuid(),
  comment: z.string().max(1000).optional().nullable(),
  signatureUrl: z.string().max(500).optional().nullable(),
});

export const rejectStepSchema = z.object({
  stepId: z.string().uuid(),
  comment: z.string().min(1, "กรุณาระบุเหตุผลการส่งกลับหรือไม่ยินยอม").max(1000),
});

export const addCommentSchema = z.object({
  documentId: z.string().uuid(),
  comment: z.string().min(1, "กรุณาระบุข้อคิดเห็น").max(1000),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type SubmitDocumentInput = z.infer<typeof submitDocumentSchema>;
export type ApproveStepInput = z.infer<typeof approveStepSchema>;
export type RejectStepInput = z.infer<typeof rejectStepSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
