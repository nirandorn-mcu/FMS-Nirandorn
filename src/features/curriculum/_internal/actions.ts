"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission, writeAudit } from "@/features/identity/server";
import { P } from "../permissions";
import {
  curriculumSchema,
  updateCurriculumSchema,
  subjectSchema,
  updateSubjectSchema,
  assignSubjectSchema,
  removeSubjectSchema,
  departmentSchema,
  updateDepartmentSchema,
} from "./validations";
import {
  getCurriculumStats,
  listCurriculums,
  getCurriculumDetail,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  assignSubjectToCurriculum,
  removeSubjectFromCurriculum,
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type CurriculumDto,
  type CurriculumDetailDto,
  type CurriculumStatsDto,
  type SubjectDto,
  type DepartmentDto,
} from "./services";

export async function getCurriculumStatsAction(): Promise<ActionResult<CurriculumStatsDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumRead);
    return getCurriculumStats(ctx.tenantId);
  });
}

export async function getCurriculumsAction(): Promise<ActionResult<CurriculumDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumRead);
    return listCurriculums(ctx.tenantId);
  });
}

export async function getCurriculumDetailAction(
  id: string
): Promise<ActionResult<CurriculumDetailDto | null>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumRead);
    return getCurriculumDetail(ctx.tenantId, id);
  });
}

export async function createCurriculumAction(
  input: unknown
): Promise<ActionResult<CurriculumDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = curriculumSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createCurriculum(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "curriculum:create",
      entity: "Curriculum",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function updateCurriculumAction(
  input: unknown
): Promise<ActionResult<CurriculumDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = updateCurriculumSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateCurriculum(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "curriculum:update",
      entity: "Curriculum",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function deleteCurriculumAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    await deleteCurriculum(ctx.tenantId, id);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "curriculum:delete",
      entity: "Curriculum",
      entityId: id,
    });
    revalidatePath("/curriculums");
  });
}

export async function getSubjectsAction(): Promise<ActionResult<SubjectDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumRead);
    return listSubjects(ctx.tenantId);
  });
}

export async function createSubjectAction(input: unknown): Promise<ActionResult<SubjectDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = subjectSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createSubject(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "subject:create",
      entity: "Subject",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function updateSubjectAction(input: unknown): Promise<ActionResult<SubjectDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = updateSubjectSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateSubject(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "subject:update",
      entity: "Subject",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function deleteSubjectAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    await deleteSubject(ctx.tenantId, id);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "subject:delete",
      entity: "Subject",
      entityId: id,
    });
    revalidatePath("/curriculums");
  });
}

export async function assignSubjectAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = assignSubjectSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await assignSubjectToCurriculum(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "curriculum:assignSubject",
      entity: "CurriculumSubject",
      entityId: `${parsed.curriculumId}:${parsed.subjectId}`,
      after: parsed,
    });
    revalidatePath("/curriculums");
  });
}

export async function removeSubjectAction(
  curriculumId: string,
  subjectId: string
): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = removeSubjectSchema.parse(
      { curriculumId, subjectId },
      { error: zodErrorMap(await getLocale()) }
    );
    await removeSubjectFromCurriculum(ctx.tenantId, parsed.curriculumId, parsed.subjectId);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "curriculum:removeSubject",
      entity: "CurriculumSubject",
      entityId: `${curriculumId}:${subjectId}`,
    });
    revalidatePath("/curriculums");
  });
}

// ----------------------------------------------------
// Department Server Actions
// ----------------------------------------------------
export async function getDepartmentsAction(): Promise<ActionResult<DepartmentDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumRead);
    return listDepartments(ctx.tenantId);
  });
}

export async function createDepartmentAction(
  input: unknown
): Promise<ActionResult<DepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = departmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createDepartment(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "department:create",
      entity: "Department",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function updateDepartmentAction(
  input: unknown
): Promise<ActionResult<DepartmentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    const parsed = updateDepartmentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await updateDepartment(ctx.tenantId, parsed);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "department:update",
      entity: "Department",
      entityId: result.id,
      after: result,
    });
    revalidatePath("/curriculums");
    return result;
  });
}

export async function deleteDepartmentAction(id: string): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(P.curriculumManage);
    await deleteDepartment(ctx.tenantId, id);
    await writeAudit({
      tenantId: ctx.tenantId,
      actorId: ctx.userId,
      action: "department:delete",
      entity: "Department",
      entityId: id,
    });
    revalidatePath("/curriculums");
  });
}
