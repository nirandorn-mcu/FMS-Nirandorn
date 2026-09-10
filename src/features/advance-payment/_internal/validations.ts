import { z } from "zod";

export const advanceItemSchema = z.object({
  itemDescription: z.string().trim().min(1),
  estimatedAmount: z.number().positive(),
});

export const createAdvanceRequestSchema = z.object({
  title: z.string().trim().min(1, { message: "error.required" }),
  description: z.string().trim().optional(),
  amount: z.number().positive({ message: "error.number" }),
  eventStartDate: z.string().min(1, { message: "error.required" }),
  eventEndDate: z.string().min(1, { message: "error.required" }),
  dueDateClearing: z.string().optional(),
  bankName: z.string().trim().optional(),
  bankAccountName: z.string().trim().optional(),
  bankAccountNo: z.string().trim().optional(),
  items: z.array(advanceItemSchema).min(1, { message: "error.required" }),
});

export const approveAdvanceRequestSchema = z.object({
  id: z.string().uuid(),
});

export const rejectAdvanceRequestSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().min(1, { message: "error.required" }),
});

export const disburseAdvanceRequestSchema = z.object({
  id: z.string().uuid(),
});

export const clearingItemSchema = z.object({
  receiptNo: z.string().trim().optional(),
  receiptDate: z.string().min(1),
  expenseTitle: z.string().trim().min(1),
  amount: z.number().positive(),
});

export const submitClearingSchema = z.object({
  advanceRequestId: z.string().uuid(),
  actualExpenseTotal: z.number().nonnegative(),
  notes: z.string().trim().optional(),
  receiptProofUrl: z.string().trim().optional(),
  items: z.array(clearingItemSchema).min(1),
});

export const approveClearingSchema = z.object({
  clearingId: z.string().uuid(),
});

export type CreateAdvanceRequestInput = z.infer<typeof createAdvanceRequestSchema>;
export type ApproveAdvanceRequestInput = z.infer<typeof approveAdvanceRequestSchema>;
export type RejectAdvanceRequestInput = z.infer<typeof rejectAdvanceRequestSchema>;
export type DisburseAdvanceRequestInput = z.infer<typeof disburseAdvanceRequestSchema>;
export type SubmitClearingInput = z.infer<typeof submitClearingSchema>;
export type ApproveClearingInput = z.infer<typeof approveClearingSchema>;
