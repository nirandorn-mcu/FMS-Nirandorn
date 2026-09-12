import { cache } from "react";
import { prisma, type Db } from "@/shared/lib/infra/prisma";
import type { Prisma } from "@/generated/prisma";
import { DEFAULT_PALETTE, isPalette, type PaletteId } from "@/shared/lib/palette";
import { errors } from "@/shared/lib/errors";
import { writeAudit } from "../audit";
import type { UpdateSettingsInput } from "../validations/settings";

export interface TenantSettings { 
  code: string; 
  nameTh: string; 
  nameEn: string; 
  logoUrl: string | null; 
  palette: PaletteId;
  smtpEmail?: string;
  smtpPassword?: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactOfficeHours?: string;
  quickExtEdu?: string;
  quickExtFinance?: string;
  quickExtPlan?: string;
  contactFacebook?: string;
  contactLine?: string;
  contactWebsite?: string;
}

export interface PublicTenantInfo {
  nameTh: string;
  nameEn: string;
  logoUrl: string | null;
  palette: PaletteId;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactOfficeHours?: string;
  quickExtEdu?: string;
  quickExtFinance?: string;
  quickExtPlan?: string;
  contactFacebook?: string;
  contactLine?: string;
  contactWebsite?: string;
}

async function readTenantSettings(tenantId: string, db: Db): Promise<TenantSettings> {
  let t = await db.tenant.findUnique({ where: { id: tenantId } });
  if (!t) {
    t = await db.tenant.findFirst({ orderBy: { createdAt: "asc" } });
  }
  if (!t) throw errors.not_found();
  const s = (t.settings ?? {}) as Record<string, unknown>;
  return { 
    code: t.code, 
    nameTh: t.nameTh, 
    nameEn: t.nameEn, 
    logoUrl: t.logoUrl, 
    palette: isPalette(s.palette) ? s.palette : DEFAULT_PALETTE,
    smtpEmail: typeof s.smtpEmail === "string" ? s.smtpEmail : undefined,
    smtpPassword: typeof s.smtpPassword === "string" ? s.smtpPassword : undefined,
    contactAddress: typeof s.contactAddress === "string" ? s.contactAddress : undefined,
    contactPhone: typeof s.contactPhone === "string" ? s.contactPhone : undefined,
    contactEmail: typeof s.contactEmail === "string" ? s.contactEmail : undefined,
    contactOfficeHours: typeof s.contactOfficeHours === "string" ? s.contactOfficeHours : undefined,
    quickExtEdu: typeof s.quickExtEdu === "string" ? s.quickExtEdu : undefined,
    quickExtFinance: typeof s.quickExtFinance === "string" ? s.quickExtFinance : undefined,
    quickExtPlan: typeof s.quickExtPlan === "string" ? s.quickExtPlan : undefined,
    contactFacebook: typeof s.contactFacebook === "string" ? s.contactFacebook : undefined,
    contactLine: typeof s.contactLine === "string" ? s.contactLine : undefined,
    contactWebsite: typeof s.contactWebsite === "string" ? s.contactWebsite : undefined,
  };
}

export async function getTenantSettings(tenantId: string): Promise<TenantSettings> {
  return readTenantSettings(tenantId, prisma);
}

export const getPublicTenantInfo = cache(async (): Promise<PublicTenantInfo> => {
  try {
    const t = await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } });
    if (!t) {
      return {
        nameTh: "คณะการบริหารและนวัตกรรมดิจิทัล",
        nameEn: "Faculty of Management and Digital Innovation",
        logoUrl: null,
        palette: DEFAULT_PALETTE,
      };
    }
    const s = (t.settings ?? {}) as Record<string, unknown>;
    return {
      nameTh: t.nameTh,
      nameEn: t.nameEn,
      logoUrl: t.logoUrl,
      palette: isPalette(s.palette) ? s.palette : DEFAULT_PALETTE,
      contactAddress: typeof s.contactAddress === "string" ? s.contactAddress : undefined,
      contactPhone: typeof s.contactPhone === "string" ? s.contactPhone : undefined,
      contactEmail: typeof s.contactEmail === "string" ? s.contactEmail : undefined,
      contactOfficeHours: typeof s.contactOfficeHours === "string" ? s.contactOfficeHours : undefined,
      quickExtEdu: typeof s.quickExtEdu === "string" ? s.quickExtEdu : undefined,
      quickExtFinance: typeof s.quickExtFinance === "string" ? s.quickExtFinance : undefined,
      quickExtPlan: typeof s.quickExtPlan === "string" ? s.quickExtPlan : undefined,
      contactFacebook: typeof s.contactFacebook === "string" ? s.contactFacebook : undefined,
      contactLine: typeof s.contactLine === "string" ? s.contactLine : undefined,
      contactWebsite: typeof s.contactWebsite === "string" ? s.contactWebsite : undefined,
    };
  } catch {
    return {
      nameTh: "คณะการบริหารและนวัตกรรมดิจิทัล",
      nameEn: "Faculty of Management and Digital Innovation",
      logoUrl: null,
      palette: DEFAULT_PALETTE,
    };
  }
});

/** เก็บคีย์อื่น ๆ ใน settings JSON ไว้ทั้งหมด — merge เฉพาะ fields ที่เปลี่ยน ไม่ทับทั้งก้อน */
export async function updateTenantSettings(input: { tenantId: string; actorId: string } & UpdateSettingsInput): Promise<void> {
  await prisma.$transaction(async (tx) => {
    let t = await tx.tenant.findUnique({ where: { id: input.tenantId } });
    let resolvedTenantId = input.tenantId;
    if (!t) {
      t = await tx.tenant.findFirst({ orderBy: { createdAt: "asc" } });
      if (t) resolvedTenantId = t.id;
    }
    if (!t) throw errors.not_found();
    const s = (t.settings ?? {}) as Record<string, unknown>;
    const before = { code: t.code, nameTh: t.nameTh, nameEn: t.nameEn, logoUrl: t.logoUrl, palette: isPalette(s.palette) ? s.palette : DEFAULT_PALETTE };
    
    const newSettings: Prisma.InputJsonObject = {
      ...(t.settings as Prisma.InputJsonObject),
      palette: input.palette,
      ...(input.smtpEmail !== undefined ? { smtpEmail: input.smtpEmail } : {}),
      ...(input.smtpPassword !== undefined ? { smtpPassword: input.smtpPassword } : {}),
      ...(input.contactAddress !== undefined ? { contactAddress: input.contactAddress } : {}),
      ...(input.contactPhone !== undefined ? { contactPhone: input.contactPhone } : {}),
      ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail } : {}),
      ...(input.contactOfficeHours !== undefined ? { contactOfficeHours: input.contactOfficeHours } : {}),
      ...(input.quickExtEdu !== undefined ? { quickExtEdu: input.quickExtEdu } : {}),
      ...(input.quickExtFinance !== undefined ? { quickExtFinance: input.quickExtFinance } : {}),
      ...(input.quickExtPlan !== undefined ? { quickExtPlan: input.quickExtPlan } : {}),
      ...(input.contactFacebook !== undefined ? { contactFacebook: input.contactFacebook } : {}),
      ...(input.contactLine !== undefined ? { contactLine: input.contactLine } : {}),
      ...(input.contactWebsite !== undefined ? { contactWebsite: input.contactWebsite } : {}),
    };
    
    await tx.tenant.update({
      where: { id: resolvedTenantId },
      data: { nameTh: input.nameTh, nameEn: input.nameEn, logoUrl: input.logoUrl || null, settings: newSettings },
    });
    await writeAudit({ tenantId: resolvedTenantId, actorId: input.actorId, action: "tenant.settings_update", entity: "tenant", entityId: resolvedTenantId, before, after: input }, tx);
  });
}

export async function getTenantPalette(tenantId: string): Promise<PaletteId> {
  const t = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } });
  const p = (t?.settings as { palette?: unknown } | null)?.palette;
  return isPalette(p) ? p : DEFAULT_PALETTE;
}

/**
 * tenant ของ session ถ้ามี — import แบบ dynamic เพราะ `../auth` ดึง next-auth ทั้งก้อนเข้ามา และ
 * โมดูลนี้ถูก import จาก root layout ที่รันทุก request · แยก try ของตัวเองไว้ต่างหากโดยเจตนา: เดิมมันอยู่
 * ใน try เดียวกับการอ่านฐานข้อมูล ทำให้ "โหลด auth ไม่ได้" กับ "ฐานข้อมูลล้ม" กลืนหายไปเป็นค่าเดียวกัน
 * และเส้นทางอ่าน tenant ทั้งเส้นทดสอบไม่ได้เลย (ในสภาพแวดล้อมเทสต์ next-auth resolve ไม่ผ่าน)
 */
async function sessionTenantId(): Promise<string | null> {
  try {
    const { auth } = await import("../auth");
    return (await auth())?.tenantId || null;
  } catch {
    return null;
  }
}

/** ใช้โดย root layout ทุก request — tenant จาก session ถ้ามี ไม่งั้น tenant แรก (หน้า login ยังไม่มี session) · ไม่ throw */
export const resolvePalette = cache(async (): Promise<PaletteId> => {
  try {
    const tenantId = (await sessionTenantId()) || (await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }))?.id;
    return tenantId ? await getTenantPalette(tenantId) : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
});
