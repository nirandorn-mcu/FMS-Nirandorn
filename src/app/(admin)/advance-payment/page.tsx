import { requirePermission, hasPermission } from "@/features/identity/server";
import { ADVANCE_P, listAdvanceRequests, getAdvanceStats } from "@/features/advance-payment/server";
import { AdvanceClient } from "./_components/advance-client";

export default async function AdvancePaymentPage() {
  const ctx = await requirePermission(ADVANCE_P.advanceRead);
  const isManager = hasPermission(ctx, ADVANCE_P.advanceManage) || hasPermission(ctx, ADVANCE_P.advanceFinance) || hasPermission(ctx, ADVANCE_P.advanceApprove);
  
  const [initialRequests, initialStats] = await Promise.all([
    listAdvanceRequests(ctx.tenantId, ctx.userId, isManager),
    getAdvanceStats(ctx.tenantId, ctx.userId, isManager),
  ]);

  return (
    <AdvanceClient
      initialRequests={initialRequests}
      initialStats={initialStats}
      currentUserId={ctx.userId}
      canCreate={hasPermission(ctx, ADVANCE_P.advanceCreate)}
      canApprove={hasPermission(ctx, ADVANCE_P.advanceApprove)}
      canFinance={hasPermission(ctx, ADVANCE_P.advanceFinance)}
      canManage={hasPermission(ctx, ADVANCE_P.advanceManage)}
    />
  );
}
