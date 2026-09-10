import type { PermissionDef } from "@/shared/lib/permission-def";

export const ADVANCE_P = {
  advanceRead: "advance:read",
  advanceCreate: "advance:create",
  advanceApprove: "advance:approve",
  advanceFinance: "advance:finance",
  advanceManage: "advance:manage",
} as const;

export const ADVANCE_PERMISSIONS: readonly PermissionDef[] = [
  { code: ADVANCE_P.advanceRead, module: "advance", action: "read", description: "ดูรายการเงินยืมทดลองจ่าย" },
  { code: ADVANCE_P.advanceCreate, module: "advance", action: "create", description: "ยื่นคำขอยืมเงินและส่งใช้เงินยืม" },
  { code: ADVANCE_P.advanceApprove, module: "advance", action: "approve", description: "อนุมัติ/ตีกลับคำขอยืมเงินทดลองจ่าย" },
  { code: ADVANCE_P.advanceFinance, module: "advance", action: "finance", description: "บันทึกจ่ายเงินยืมและตรวจรับการเคลียร์เงิน" },
  { code: ADVANCE_P.advanceManage, module: "advance", action: "manage", description: "บริหารจัดการระบบเงินยืมทดลองจ่ายทั้งหมด" },
];
