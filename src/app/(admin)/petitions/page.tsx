import { requirePermission, hasPermission } from "@/features/identity/server";
import { PETITION_P, listPetitions, getPetitionStats } from "@/features/student-petition/server";
import { PetitionsClient } from "./_components/petitions-client";

export default async function PetitionsPage() {
  const ctx = await requirePermission(PETITION_P.petitionRead);
  const isStaffOrAdmin =
    hasPermission(ctx, PETITION_P.petitionManage) ||
    hasPermission(ctx, PETITION_P.petitionAdvisor) ||
    hasPermission(ctx, PETITION_P.petitionOfficer) ||
    hasPermission(ctx, PETITION_P.petitionDean);

  const [initialPetitions, initialStats] = await Promise.all([
    listPetitions(ctx.tenantId, ctx.userId, isStaffOrAdmin),
    getPetitionStats(ctx.tenantId, ctx.userId, isStaffOrAdmin),
  ]);

  return (
    <PetitionsClient
      initialPetitions={initialPetitions}
      initialStats={initialStats}
      currentUserId={ctx.userId}
      currentUserEmail={ctx.email}
      currentUserName={ctx.userName}
      canCreate={hasPermission(ctx, PETITION_P.petitionCreate)}
      canAdvisor={hasPermission(ctx, PETITION_P.petitionAdvisor)}
      canOfficer={hasPermission(ctx, PETITION_P.petitionOfficer)}
      canDean={hasPermission(ctx, PETITION_P.petitionDean)}
      canManage={hasPermission(ctx, PETITION_P.petitionManage)}
    />
  );
}
