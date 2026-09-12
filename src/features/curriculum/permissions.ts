import type { PermissionDef } from "@/shared/lib/permission-def";

export const P = {
  curriculumRead: "curriculum:read",
  curriculumManage: "curriculum:manage",
} as const;

export const CURRICULUM_PERMISSIONS: PermissionDef[] = [
  { code: P.curriculumRead, module: "curriculum", action: "read" },
  { code: P.curriculumManage, module: "curriculum", action: "manage" },
];
