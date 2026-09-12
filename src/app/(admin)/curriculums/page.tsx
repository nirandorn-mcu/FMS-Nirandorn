import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  CURRICULUM_P,
  getCurriculumStats,
  listCurriculums,
  listSubjects,
  listDepartments,
} from "@/features/curriculum/server";
import { CurriculumClient } from "./_components/curriculum-client";

export default async function CurriculumPage() {
  const ctx = await requirePermission(CURRICULUM_P.curriculumRead);
  const [stats, initialCurriculums, initialSubjects, initialDepartments] = await Promise.all([
    getCurriculumStats(ctx.tenantId),
    listCurriculums(ctx.tenantId),
    listSubjects(ctx.tenantId),
    listDepartments(ctx.tenantId),
  ]);

  const canManage = hasPermission(ctx, CURRICULUM_P.curriculumManage);

  return (
    <CurriculumClient
      initialStats={stats}
      initialCurriculums={initialCurriculums}
      initialSubjects={initialSubjects}
      initialDepartments={initialDepartments}
      canManage={canManage}
    />
  );
}
