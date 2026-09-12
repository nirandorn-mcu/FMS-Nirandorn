import { z } from "zod";

export const curriculumSchema = z.object({
  departmentId: z.string().uuid().optional().nullable(),
  code: z.string().min(1, "code_required").max(50),
  nameTh: z.string().min(1, "name_th_required").max(255),
  nameEn: z.string().min(1, "name_en_required").max(255),
  degreeTh: z.string().max(255).optional().nullable(),
  degreeEn: z.string().max(255).optional().nullable(),
  faculty: z.string().max(255).optional().nullable(),
  totalCredits: z.coerce.number().int().min(0).default(0),
  revisionYear: z.coerce.number().int().min(2500).max(2600),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  durationYears: z.coerce.number().int().min(1).max(10).optional().nullable(),
  studyType: z.string().max(255).optional().nullable(),
  campusLocation: z.string().max(255).optional().nullable(),
  philosophy: z.string().max(10000).optional().nullable(),
  objectives: z.string().max(10000).optional().nullable(),
  careerPaths: z.string().max(10000).optional().nullable(),
  admissionReq: z.string().max(10000).optional().nullable(),
  tuitionFees: z.string().max(255).optional().nullable(),
  graduationCriteria: z.string().max(10000).optional().nullable(),
  plos: z.any().optional().nullable(),
});

export const updateCurriculumSchema = curriculumSchema.extend({
  id: z.string().uuid(),
});

export const departmentSchema = z.object({
  code: z.string().min(1, "code_required").max(50),
  nameTh: z.string().min(1, "name_th_required").max(255),
  nameEn: z.string().min(1, "name_en_required").max(255),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateDepartmentSchema = departmentSchema.extend({
  id: z.string().uuid(),
});

export const subjectSchema = z.object({
  code: z.string().min(1, "code_required").max(50),
  nameTh: z.string().min(1, "name_th_required").max(255),
  nameEn: z.string().min(1, "name_en_required").max(255),
  credits: z.coerce.number().int().min(0).max(20).default(3),
  creditInfo: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateSubjectSchema = subjectSchema.extend({
  id: z.string().uuid(),
});

export const assignSubjectSchema = z.object({
  curriculumId: z.string().uuid(),
  subjectId: z.string().uuid(),
  category: z.string().min(1).max(255),
  isCompulsory: z.boolean().default(true),
});

export const removeSubjectSchema = z.object({
  curriculumId: z.string().uuid(),
  subjectId: z.string().uuid(),
});

export type CurriculumInput = z.infer<typeof curriculumSchema>;
export type UpdateCurriculumInput = z.infer<typeof updateCurriculumSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type AssignSubjectInput = z.infer<typeof assignSubjectSchema>;
export type RemoveSubjectInput = z.infer<typeof removeSubjectSchema>;
