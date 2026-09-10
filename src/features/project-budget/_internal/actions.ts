"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { PROJECT_P } from "../permissions";
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectExpenseSchema,
  deleteProjectExpenseSchema,
  addProjectKpiSchema,
  updateProjectKpiSchema,
} from "./validations";
import {
  listProjects,
  getProjectStats,
  listResponsibleUsers,
  createProject,
  updateProject,
  addProjectExpense,
  deleteProjectExpense,
  addProjectKpi,
  updateProjectKpi,
  type ProjectDto,
  type ProjectStatsDto,
  type ProjectUserOption,
} from "./services";

export async function getProjectsAction(fiscalYear?: number): Promise<ActionResult<ProjectDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectRead);
    return listProjects(ctx.tenantId, fiscalYear);
  });
}

export async function getProjectStatsAction(fiscalYear?: number): Promise<ActionResult<ProjectStatsDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectRead);
    return getProjectStats(ctx.tenantId, fiscalYear);
  });
}

export async function getResponsibleUsersAction(): Promise<ActionResult<ProjectUserOption[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectRead);
    return listResponsibleUsers(ctx.tenantId);
  });
}

export async function createProjectAction(input: unknown): Promise<ActionResult<ProjectDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectCreate);
    const parsed = createProjectSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createProject(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
    return result;
  });
}

export async function updateProjectAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectManage);
    const parsed = updateProjectSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await updateProject(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
  });
}

export async function addProjectExpenseAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectManage);
    const parsed = addProjectExpenseSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await addProjectExpense(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
  });
}

export async function deleteProjectExpenseAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectManage);
    const parsed = deleteProjectExpenseSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await deleteProjectExpense(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
  });
}

export async function addProjectKpiAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectManage);
    const parsed = addProjectKpiSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await addProjectKpi(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
  });
}

export async function updateProjectKpiAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PROJECT_P.projectManage);
    const parsed = updateProjectKpiSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await updateProjectKpi(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/projects");
  });
}
