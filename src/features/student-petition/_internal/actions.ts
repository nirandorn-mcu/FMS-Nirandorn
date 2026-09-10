"use server";

import { revalidatePath } from "next/cache";
import { runAction, type ActionResult } from "@/shared/lib/result";
import { getLocale } from "@/shared/lib/i18n/server";
import { zodErrorMap } from "@/shared/lib/i18n/zod-locale";
import { requirePermission, hasPermission } from "@/features/identity/server";
import { PETITION_P } from "../permissions";
import {
  createPetitionSchema,
  advisorReviewSchema,
  officerReviewSchema,
  deanReviewSchema,
  rejectPetitionSchema,
  cancelPetitionSchema,
} from "./validations";
import {
  listPetitions,
  getPetitionStats,
  createPetition,
  reviewByAdvisor,
  reviewByOfficer,
  reviewByDean,
  rejectPetition,
  cancelPetition,
  type StudentPetitionDto,
  type PetitionStatsDto,
} from "./services";

export async function getPetitionsAction(): Promise<ActionResult<StudentPetitionDto[]>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionRead);
    const isStaffOrAdmin =
      hasPermission(ctx, PETITION_P.petitionManage) ||
      hasPermission(ctx, PETITION_P.petitionAdvisor) ||
      hasPermission(ctx, PETITION_P.petitionOfficer) ||
      hasPermission(ctx, PETITION_P.petitionDean);

    return listPetitions(ctx.tenantId, ctx.userId, isStaffOrAdmin);
  });
}

export async function getPetitionStatsAction(): Promise<ActionResult<PetitionStatsDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionRead);
    const isStaffOrAdmin =
      hasPermission(ctx, PETITION_P.petitionManage) ||
      hasPermission(ctx, PETITION_P.petitionAdvisor) ||
      hasPermission(ctx, PETITION_P.petitionOfficer) ||
      hasPermission(ctx, PETITION_P.petitionDean);

    return getPetitionStats(ctx.tenantId, ctx.userId, isStaffOrAdmin);
  });
}

export async function createPetitionAction(input: unknown): Promise<ActionResult<StudentPetitionDto>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionCreate);
    const parsed = createPetitionSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    const result = await createPetition(ctx.tenantId, ctx.userId, parsed);
    revalidatePath("/petitions");
    return result;
  });
}

export async function reviewByAdvisorAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionAdvisor);
    const parsed = advisorReviewSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await reviewByAdvisor(ctx.tenantId, ctx.userId, ctx.userName, parsed);
    revalidatePath("/petitions");
  });
}

export async function reviewByOfficerAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionOfficer);
    const parsed = officerReviewSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await reviewByOfficer(ctx.tenantId, ctx.userId, ctx.userName, parsed);
    revalidatePath("/petitions");
  });
}

export async function reviewByDeanAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionDean);
    const parsed = deanReviewSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await reviewByDean(ctx.tenantId, ctx.userId, ctx.userName, parsed);
    revalidatePath("/petitions");
  });
}

export async function rejectPetitionAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionRead);
    const parsed = rejectPetitionSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await rejectPetition(ctx.tenantId, ctx.userId, ctx.userName, parsed);
    revalidatePath("/petitions");
  });
}

export async function cancelPetitionAction(input: unknown): Promise<ActionResult<void>> {
  return runAction(async () => {
    const ctx = await requirePermission(PETITION_P.petitionCreate);
    const parsed = cancelPetitionSchema.parse(input, { error: zodErrorMap(await getLocale()) });
    await cancelPetition(ctx.tenantId, ctx.userId, ctx.userName, parsed);
    revalidatePath("/petitions");
  });
}
