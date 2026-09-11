"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission } from "@/features/identity/server";
import { DOC_P } from "../permissions";
import {
  createDocumentSchema,
  submitDocumentSchema,
  approveStepSchema,
  rejectStepSchema,
  addCommentSchema,
} from "./validations";
import {
  listDocuments,
  getDocumentById,
  getDocumentStats,
  createDocument,
  submitDocument,
  approveStep,
  rejectStep,
  addDocumentComment,
  type DocumentDto,
  type DocumentStatsDto,
} from "./services";

export async function getDocumentsAction(status?: string): Promise<ActionResult<DocumentDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docRead);
    return listDocuments(ctx.tenantId, status);
  });
}

export async function getDocumentByIdAction(id: string): Promise<ActionResult<DocumentDto | null>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docRead);
    return getDocumentById(ctx.tenantId, id);
  });
}

export async function getDocumentStatsAction(): Promise<ActionResult<DocumentStatsDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docRead);
    return getDocumentStats(ctx.tenantId);
  });
}

export async function createDocumentAction(input: unknown): Promise<ActionResult<DocumentDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docCreate);
    const parsed = createDocumentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createDocument(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/documents");
    return result;
  });
}

export async function submitDocumentAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docCreate);
    const parsed = submitDocumentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await submitDocument(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/documents");
  });
}

export async function approveStepAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docApprove);
    const parsed = approveStepSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await approveStep(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/documents");
  });
}

export async function rejectStepAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docApprove);
    const parsed = rejectStepSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await rejectStep(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/documents");
  });
}

export async function addDocumentCommentAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(DOC_P.docRead);
    const parsed = addCommentSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await addDocumentComment(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/documents");
  });
}
