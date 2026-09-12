import type { PermissionDef } from "@/shared/lib/permission-def";

export const P = {
  usersRead: "users:read",
  usersManage: "users:manage",
  rolesManage: "roles:manage",
  settingsManage: "settings:manage",
  auditRead: "audit:read",
} as const;

export const IDENTITY_PERMISSIONS: readonly PermissionDef[] = [
  { code: P.usersRead, module: "users", action: "read" },
  { code: P.usersManage, module: "users", action: "manage" },
  { code: P.rolesManage, module: "roles", action: "manage" },
  { code: P.settingsManage, module: "settings", action: "manage" },
  { code: P.auditRead, module: "audit", action: "read" },
];

import { SAMPLE_P } from "@/features/sample/permissions";
import { ADVANCE_P } from "@/features/advance-payment/permissions";
import { PETITION_P } from "@/features/student-petition/permissions";
import { PROJECT_P } from "@/features/project-budget/permissions";
import { DOC_P } from "@/features/document-flow/permissions";
import { P as CURRICULUM_P } from "@/features/curriculum/permissions";

/** บทบาทตั้งต้น — seed และ bootstrap ใช้ร่วมกัน */
export const SUPER_ADMIN_CODE = "SUPER_ADMIN";
export const DEFAULT_ROLES: ReadonlyArray<{ code: string; nameTh: string; nameEn: string; isSystem: boolean; permissions: readonly string[] }> = [
  { code: SUPER_ADMIN_CODE, nameTh: "ผู้ดูแลสูงสุด", nameEn: "Super admin", isSystem: true, permissions: [] },
  { code: "ADMIN", nameTh: "ผู้ดูแลระบบ", nameEn: "Administrator", isSystem: false, permissions: [P.usersRead, P.usersManage, P.rolesManage, P.settingsManage, P.auditRead, SAMPLE_P.sampleRead, SAMPLE_P.sampleManage, ADVANCE_P.advanceRead, ADVANCE_P.advanceCreate, ADVANCE_P.advanceApprove, ADVANCE_P.advanceFinance, ADVANCE_P.advanceManage, PETITION_P.petitionRead, PETITION_P.petitionCreate, PETITION_P.petitionAdvisor, PETITION_P.petitionOfficer, PETITION_P.petitionDean, PETITION_P.petitionManage, PROJECT_P.projectRead, PROJECT_P.projectCreate, PROJECT_P.projectManage, PROJECT_P.projectPlan, PROJECT_P.projectExecutive, DOC_P.docRead, DOC_P.docCreate, DOC_P.docApprove, DOC_P.docManage, CURRICULUM_P.curriculumRead, CURRICULUM_P.curriculumManage] },
  { code: "STAFF", nameTh: "เจ้าหน้าที่", nameEn: "Staff", isSystem: false, permissions: [P.usersRead, ADVANCE_P.advanceRead, ADVANCE_P.advanceCreate, PETITION_P.petitionRead, PETITION_P.petitionAdvisor, PETITION_P.petitionOfficer, PROJECT_P.projectRead, PROJECT_P.projectCreate, PROJECT_P.projectManage, DOC_P.docRead, DOC_P.docCreate, DOC_P.docApprove, CURRICULUM_P.curriculumRead, CURRICULUM_P.curriculumManage] },
  { code: "VIEWER", nameTh: "ผู้ดู", nameEn: "Viewer", isSystem: false, permissions: [P.usersRead, ADVANCE_P.advanceRead, PETITION_P.petitionRead, PETITION_P.petitionCreate, PROJECT_P.projectRead, DOC_P.docRead, CURRICULUM_P.curriculumRead] },
];
