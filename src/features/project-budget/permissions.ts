import type { PermissionDef } from "@/shared/lib/permission-def";

export const PROJECT_P = {
  projectRead: "project:read",
  projectCreate: "project:create",
  projectManage: "project:manage",
  projectPlan: "project:plan",
  projectExecutive: "project:executive",
} as const;

export const PROJECT_PERMISSIONS: readonly PermissionDef[] = [
  { code: PROJECT_P.projectRead, module: "project", action: "read", description: "ดูรายการโครงการและงบประมาณ" },
  { code: PROJECT_P.projectCreate, module: "project", action: "create", description: "เสนอโครงการใหม่" },
  { code: PROJECT_P.projectManage, module: "project", action: "manage", description: "บันทึกค่าใช้จ่ายและอัปเดตผลตัวชี้วัดโครงการ" },
  { code: PROJECT_P.projectPlan, module: "project", action: "plan", description: "ตรวจสอบแผนยุทธศาสตร์และปรับงบประมาณโครงการ" },
  { code: PROJECT_P.projectExecutive, module: "project", action: "executive", description: "ดูสรุปภาพรวมงบประมาณและผลการดำเนินงานระดับผู้บริหาร" },
];
