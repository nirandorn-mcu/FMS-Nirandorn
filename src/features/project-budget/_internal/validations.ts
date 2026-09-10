import { z } from "zod";

export const budgetSourceEnum = z.enum([
  "GOVERNMENT",
  "REVENUE",
  "RESEARCH_GRANT",
  "DONATION",
  "OTHER",
]);

export const projectStatusEnum = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "SUSPENDED",
]);

export const kpiStatusEnum = z.enum([
  "PENDING",
  "ON_TRACK",
  "AT_RISK",
  "ACHIEVED",
]);

export const projectKpiInputSchema = z.object({
  indicatorName: z.string().trim().min(1, { message: "error.required" }),
  targetValue: z.coerce.number().positive({ message: "error.number" }),
  unit: z.string().trim().min(1, { message: "error.required" }),
});

export const createProjectSchema = z.object({
  code: z.string().trim().min(1, { message: "error.required" }),
  nameTh: z.string().trim().min(1, { message: "error.required" }),
  nameEn: z.string().trim().optional(),
  fiscalYear: z.coerce.number().int().min(2500, { message: "error.number" }),
  strategicPlan: z.string().trim().optional(),
  budgetSource: budgetSourceEnum,
  allocatedBudget: z.coerce.number().positive({ message: "error.number" }),
  responsiblePersonId: z.string().uuid({ message: "error.required" }),
  startDate: z.string().min(1, { message: "error.required" }),
  endDate: z.string().min(1, { message: "error.required" }),
  description: z.string().trim().optional(),
  kpis: z.array(projectKpiInputSchema).optional().default([]),
});

export const updateProjectSchema = z.object({
  id: z.string().uuid(),
  nameTh: z.string().trim().min(1, { message: "error.required" }),
  nameEn: z.string().trim().optional(),
  fiscalYear: z.coerce.number().int().min(2500, { message: "error.number" }),
  strategicPlan: z.string().trim().optional(),
  budgetSource: budgetSourceEnum,
  allocatedBudget: z.coerce.number().positive({ message: "error.number" }),
  status: projectStatusEnum,
  startDate: z.string().min(1, { message: "error.required" }),
  endDate: z.string().min(1, { message: "error.required" }),
  description: z.string().trim().optional(),
});

export const addProjectExpenseSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().trim().min(1, { message: "error.required" }),
  amount: z.coerce.number().positive({ message: "error.number" }),
  expenseDate: z.string().min(1, { message: "error.required" }),
  receiptRef: z.string().trim().optional(),
});

export const deleteProjectExpenseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
});

export const addProjectKpiSchema = z.object({
  projectId: z.string().uuid(),
  indicatorName: z.string().trim().min(1, { message: "error.required" }),
  targetValue: z.coerce.number().positive({ message: "error.number" }),
  unit: z.string().trim().min(1, { message: "error.required" }),
});

export const updateProjectKpiSchema = z.object({
  id: z.string().uuid(),
  actualValue: z.coerce.number().nonnegative({ message: "error.number" }),
  status: kpiStatusEnum,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectExpenseInput = z.infer<typeof addProjectExpenseSchema>;
export type DeleteProjectExpenseInput = z.infer<typeof deleteProjectExpenseSchema>;
export type AddProjectKpiInput = z.infer<typeof addProjectKpiSchema>;
export type UpdateProjectKpiInput = z.infer<typeof updateProjectKpiSchema>;
