import { z } from "zod";

export const petitionTypeEnum = z.enum([
  "LATE_ENROLL",
  "LEAVE",
  "RESIGN",
  "TUITION_WAIVER",
  "COURSE_ADD_DROP",
  "GENERAL",
]);

export const createPetitionSchema = z.object({
  studentCode: z.string().trim().min(1, { message: "error.required" }),
  studentName: z.string().trim().min(1, { message: "error.required" }),
  studentEmail: z.string().trim().email({ message: "error.email" }),
  major: z.string().trim().min(1, { message: "error.required" }),
  yearLevel: z.coerce.number().int().min(1).max(8, { message: "error.number" }),
  petitionType: petitionTypeEnum,
  title: z.string().trim().min(1, { message: "error.required" }),
  details: z.string().trim().min(1, { message: "error.required" }),
  evidenceUrls: z.array(z.string().trim()).optional().default([]),
});

export const advisorReviewSchema = z.object({
  id: z.string().uuid(),
  comment: z.string().trim().optional(),
});

export const officerReviewSchema = z.object({
  id: z.string().uuid(),
  comment: z.string().trim().optional(),
});

export const deanReviewSchema = z.object({
  id: z.string().uuid(),
  comment: z.string().trim().optional(),
});

export const rejectPetitionSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().min(1, { message: "error.required" }),
});

export const cancelPetitionSchema = z.object({
  id: z.string().uuid(),
});

export type CreatePetitionInput = z.infer<typeof createPetitionSchema>;
export type AdvisorReviewInput = z.infer<typeof advisorReviewSchema>;
export type OfficerReviewInput = z.infer<typeof officerReviewSchema>;
export type DeanReviewInput = z.infer<typeof deanReviewSchema>;
export type RejectPetitionInput = z.infer<typeof rejectPetitionSchema>;
export type CancelPetitionInput = z.infer<typeof cancelPetitionSchema>;
