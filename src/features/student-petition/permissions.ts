import type { PermissionDef } from "@/shared/lib/permission-def";

export const PETITION_P = {
  petitionRead: "petition:read",
  petitionCreate: "petition:create",
  petitionAdvisor: "petition:advisor",
  petitionOfficer: "petition:officer",
  petitionDean: "petition:dean",
  petitionManage: "petition:manage",
} as const;

export const PETITION_PERMISSIONS: readonly PermissionDef[] = [
  { code: PETITION_P.petitionRead, module: "petition", action: "read", description: "ดูรายการคำร้องนิสิต" },
  { code: PETITION_P.petitionCreate, module: "petition", action: "create", description: "ยื่นและยกเลิกคำร้องนิสิต" },
  { code: PETITION_P.petitionAdvisor, module: "petition", action: "advisor", description: "อาจารย์ที่ปรึกษาพิจารณาให้ความเห็นชอบคำร้อง" },
  { code: PETITION_P.petitionOfficer, module: "petition", action: "officer", description: "เจ้าหน้าที่ทะเบียน/วิชาการตรวจสอบคำร้อง" },
  { code: PETITION_P.petitionDean, module: "petition", action: "dean", description: "คณบดี/ผู้บริหารอนุมัติคำร้องขั้นสุดท้าย" },
  { code: PETITION_P.petitionManage, module: "petition", action: "manage", description: "บริหารจัดการระบบคำร้องนิสิตทั้งหมด" },
];
