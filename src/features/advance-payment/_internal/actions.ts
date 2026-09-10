"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission, hasPermission } from "@/features/identity/server";
import { ADVANCE_P } from "../permissions";
import {
  createAdvanceRequestSchema,
  approveAdvanceRequestSchema,
  rejectAdvanceRequestSchema,
  disburseAdvanceRequestSchema,
  submitClearingSchema,
  approveClearingSchema,
} from "./validations";
import {
  listAdvanceRequests,
  getAdvanceStats,
  createAdvanceRequest,
  approveAdvanceRequest,
  rejectAdvanceRequest,
  disburseAdvanceRequest,
  submitClearing,
  approveClearing,
  type AdvanceRequestDto,
  type AdvanceStatsDto,
} from "./services";

export async function getAdvanceRequestsAction(): Promise<ActionResult<AdvanceRequestDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceRead);
    const isManager = hasPermission(ctx, ADVANCE_P.advanceManage) || hasPermission(ctx, ADVANCE_P.advanceFinance) || hasPermission(ctx, ADVANCE_P.advanceApprove);
    return listAdvanceRequests(ctx.tenantId, ctx.userId, isManager);
  });
}

export async function getAdvanceStatsAction(): Promise<ActionResult<AdvanceStatsDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceRead);
    const isManager = hasPermission(ctx, ADVANCE_P.advanceManage) || hasPermission(ctx, ADVANCE_P.advanceFinance) || hasPermission(ctx, ADVANCE_P.advanceApprove);
    return getAdvanceStats(ctx.tenantId, ctx.userId, isManager);
  });
}

export async function createAdvanceRequestAction(input: unknown): Promise<ActionResult<AdvanceRequestDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceCreate);
    const parsed = createAdvanceRequestSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createAdvanceRequest(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
    return result;
  });
}

export async function approveAdvanceRequestAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceApprove);
    const parsed = approveAdvanceRequestSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await approveAdvanceRequest(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
  });
}

export async function rejectAdvanceRequestAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceApprove);
    const parsed = rejectAdvanceRequestSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await rejectAdvanceRequest(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
  });
}

export async function disburseAdvanceRequestAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceFinance);
    const parsed = disburseAdvanceRequestSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await disburseAdvanceRequest(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
  });
}

export async function submitClearingAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceCreate);
    const parsed = submitClearingSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await submitClearing(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
  });
}

export async function approveClearingAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(ADVANCE_P.advanceFinance);
    const parsed = approveClearingSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await approveClearing(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/advance-payment");
  });
}
