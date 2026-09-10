import { requirePermission, hasPermission } from "@/features/identity/server";
import {
  PROJECT_P,
  listProjects,
  getProjectStats,
  listResponsibleUsers,
} from "@/features/project-budget/server";
import { ProjectsClient } from "./_components/projects-client";

export default async function ProjectsPage() {
  const ctx = await requirePermission(PROJECT_P.projectRead);

  const [initialProjects, initialStats, userOptions] = await Promise.all([
    listProjects(ctx.tenantId),
    getProjectStats(ctx.tenantId),
    listResponsibleUsers(ctx.tenantId),
  ]);

  return (
    <ProjectsClient
      initialProjects={initialProjects}
      initialStats={initialStats}
      userOptions={userOptions}
      currentUserId={ctx.userId}
      canCreate={hasPermission(ctx, PROJECT_P.projectCreate)}
      canManage={hasPermission(ctx, PROJECT_P.projectManage)}
      canPlan={hasPermission(ctx, PROJECT_P.projectPlan)}
      canExecutive={hasPermission(ctx, PROJECT_P.projectExecutive)}
    />
  );
}
