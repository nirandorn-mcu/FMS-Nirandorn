import type { PermissionDef } from "@/shared/lib/permission-def";

export const DOC_P = {
  docRead: "doc:read",
  docCreate: "doc:create",
  docApprove: "doc:approve",
  docManage: "doc:manage",
} as const;

export const DOC_PERMISSIONS: readonly PermissionDef[] = [
  { code: DOC_P.docRead, module: "doc", action: "read", description: "ดูรายการเอกสารและติดตามสถานะหนังสือ" },
  { code: DOC_P.docCreate, module: "doc", action: "create", description: "ร่างและสร้างหนังสือขออนุมัติ" },
  { code: DOC_P.docApprove, module: "doc", action: "approve", description: "ลงนามและพิจารณาอนุมัติเอกสารตามลำดับขั้น" },
  { code: DOC_P.docManage, module: "doc", action: "manage", description: "จัดการประเภทเอกสารและเส้นทางการอนุมัติ" },
];
